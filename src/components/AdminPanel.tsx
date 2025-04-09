
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { User, Shield, ShieldCheck, ShieldX, Trash2, UserCog, RefreshCw } from 'lucide-react';
import { User as UserType, getUsers, toggleUserAdminStatus, validateAdminPassword, deleteUser } from '@/lib/auth';

interface AdminPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onOpenChange }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Check if user is admin when the component mounts or updates
  useEffect(() => {
    if (user?.isAdmin) {
      setIsPasswordVerified(true);
    }
  }, [user]);

  const loadUsers = () => {
    setUsers(getUsers());
  };

  const verifyAdminPassword = () => {
    if (validateAdminPassword(adminPassword)) {
      setIsPasswordVerified(true);
      setAdminPasswordError('');
      setIsVerifyDialogOpen(false);
    } else {
      setAdminPasswordError('Incorrect admin password. Please try again.');
    }
  };

  const handleToggleAdmin = (userId: string) => {
    if (toggleUserAdminStatus(userId)) {
      loadUsers();
      
      // If we're toggling our own admin status, show an appropriate message
      if (userId === user?.id) {
        const updatedUsers = getUsers();
        const updatedUser = updatedUsers.find(u => u.id === userId);
        if (updatedUser) {
          toast({
            title: updatedUser.isAdmin ? "Admin status granted" : "Admin status removed",
            description: updatedUser.isAdmin 
              ? "You now have admin privileges" 
              : "Your admin privileges have been removed",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "User admin status updated",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to update user admin status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (deleteUser(userId)) {
      setShowConfirmDelete(null);
      loadUsers();
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setAdminPassword('');
      setAdminPasswordError('');
      // Don't reset isPasswordVerified here to maintain admin status
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <UserCog size={20} />
              Admin Panel
            </SheetTitle>
            <SheetDescription>
              Manage users and admin permissions.
            </SheetDescription>
          </SheetHeader>

          {!isPasswordVerified && !user?.isAdmin ? (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <Shield size={48} className="text-primary/50 mb-4" />
              <h3 className="text-xl font-medium mb-2">Admin Access Required</h3>
              <p className="text-muted-foreground text-center mb-6">
                You need admin privileges to access this panel.
              </p>
              <Button onClick={() => setIsVerifyDialogOpen(true)}>Verify Admin Password</Button>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Users</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadUsers}
                    className="h-8 gap-1"
                  >
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                  </Button>
                  <p className="text-sm text-muted-foreground">{users.length} total</p>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{userData.username}</span>
                            <span className="text-xs text-muted-foreground">{userData.displayName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {userData.isAdmin ? (
                            <span className="flex items-center gap-1 text-xs">
                              <ShieldCheck size={14} className="text-primary" />
                              Admin
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User size={14} />
                              User
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAdmin(userData.id)}
                              className="h-8 w-8 p-0"
                              title={userData.isAdmin ? "Remove admin" : "Make admin"}
                            >
                              {userData.isAdmin ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowConfirmDelete(userData.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              title="Delete user"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Admin Password Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield size={18} />
              Admin Verification
            </DialogTitle>
            <DialogDescription>
              Enter the admin password to access the admin panel.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="mt-1"
            />
            {adminPasswordError && (
              <p className="text-destructive text-sm mt-1">{adminPasswordError}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={verifyAdminPassword}>Verify Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showConfirmDelete} onOpenChange={(open) => !open && setShowConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 size={18} />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => showConfirmDelete && handleDeleteUser(showConfirmDelete)}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPanel;
