import React, { useState } from 'react';
import { Users, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useGetStaff, useAddStaff } from '../../hooks/useStaffMaster';
import { HOTEL_DESIGNATIONS } from '../../lib/hotelDesignations';
import { formatCurrency } from '../../lib/currency';
import type { Staff } from '../../backend';

interface StaffMasterPanelProps {
  onSelectStaff?: (staff: Staff) => void;
}

const DEFAULT_DA = 8419;

export function StaffMasterPanel({ onSelectStaff }: StaffMasterPanelProps) {
  const { data: staffList = [], isLoading } = useGetStaff();
  const addStaffMutation = useAddStaff();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [basic, setBasic] = useState('');
  const [otherAllowance, setOtherAllowance] = useState('0');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!designation) {
      setError('Designation is required');
      return;
    }

    const basicNum = parseFloat(basic) || 0;
    const otherAllowanceNum = parseFloat(otherAllowance) || 0;

    if (basicNum < 0 || otherAllowanceNum < 0) {
      setError('Salary components cannot be negative');
      return;
    }

    try {
      await addStaffMutation.mutateAsync({
        name: name.trim(),
        mobile: mobile.trim(),
        designation,
        basic: basicNum,
        da: DEFAULT_DA,
        otherAllowance: otherAllowanceNum,
      });

      setSuccess(true);
      setName('');
      setMobile('');
      setDesignation('');
      setBasic('');
      setOtherAllowance('0');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add staff');
    }
  };

  const monthlyGrossPay = (parseFloat(basic) || 0) + DEFAULT_DA + (parseFloat(otherAllowance) || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold text-foreground">Staff Master</h2>
          <p className="text-muted-foreground">Manage staff members and their salary details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add Staff Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Staff</CardTitle>
            <CardDescription>Enter staff member details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="staff-name"
                  type="text"
                  placeholder="Enter staff name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={addStaffMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-mobile">Mobile Number</Label>
                <Input
                  id="staff-mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={addStaffMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-designation">
                  Designation <span className="text-destructive">*</span>
                </Label>
                <Select value={designation} onValueChange={setDesignation} disabled={addStaffMutation.isPending}>
                  <SelectTrigger id="staff-designation">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOTEL_DESIGNATIONS.map((des) => (
                      <SelectItem key={des} value={des}>
                        {des}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-basic">Basic Salary</Label>
                <Input
                  id="staff-basic"
                  type="number"
                  placeholder="0.00"
                  value={basic}
                  onChange={(e) => setBasic(e.target.value)}
                  disabled={addStaffMutation.isPending}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-da">DA (Fixed)</Label>
                <Input
                  id="staff-da"
                  type="text"
                  value={formatCurrency(DEFAULT_DA)}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-other">Other Allowance</Label>
                <Input
                  id="staff-other"
                  type="number"
                  placeholder="0.00"
                  value={otherAllowance}
                  onChange={(e) => setOtherAllowance(e.target.value)}
                  disabled={addStaffMutation.isPending}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Monthly Gross Pay</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(monthlyGrossPay)}
                  </span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-primary/10 border-primary/20">
                  <AlertDescription className="text-primary">
                    Staff member added successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={addStaffMutation.isPending}>
                {addStaffMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle>Staff List</CardTitle>
            <CardDescription>
              {staffList.length} staff member{staffList.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : staffList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No staff members added yet
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead className="text-right">Gross Pay</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((staff) => {
                      const grossPay = staff.basic + staff.da + staff.otherAllowance;
                      return (
                        <TableRow key={staff.name}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell className="text-muted-foreground">{staff.designation}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(grossPay)}
                          </TableCell>
                          <TableCell>
                            {onSelectStaff && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onSelectStaff(staff)}
                              >
                                Select
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
