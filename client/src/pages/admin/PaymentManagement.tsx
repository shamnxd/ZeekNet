import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { PaymentOrder } from '@/interfaces/admin/payment-order.interface';
import { toast } from 'sonner';
import { format } from 'date-fns';

const PaymentManagement = () => {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchPaymentOrders = useCallback(async () => {
    setLoading(true);
    try {
      const query: Record<string, unknown> = {
        page,
        limit,
        sortOrder,
      };

      if (statusFilter && statusFilter !== 'all') {
        query.status = statusFilter;
      }

      if (search) {
        query.search = search;
      }

      const response = await adminApi.getPaymentOrders(query);

      if (response.success && response.data) {
        setPaymentOrders(response.data.orders);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.message || 'Failed to fetch payment orders');
      }
    } catch (error) {
      toast.error('An error occurred while fetching payment orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortOrder, statusFilter, search]);

  useEffect(() => {
    fetchPaymentOrders();
  }, [fetchPaymentOrders]);

  const handleSearch = () => {
    setPage(1);
    fetchPaymentOrders();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'stripe':
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">Stripe</Badge>;
      case 'card':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Card</Badge>;
      case 'dummy':
        return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">Offline</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency;
    return `${currencySymbol} ${amount.toFixed(2)}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all payment orders
            </p>
          </div>
          <Button 
            variant="outline" 
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">
                All Payment Orders
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by order, company, plan..."
                    className="pl-10 w-full sm:w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading payment orders...</p>
              </div>
            ) : paymentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No payment orders found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order No</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{order.orderNo}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.companyName}</p>
                              {order.transactionId && (
                                <p className="text-xs text-gray-500">TXN: {order.transactionId}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{order.planName}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(order.amount, order.currency)}
                          </TableCell>
                          <TableCell>{getPaymentMethodBadge(order.paymentMethod)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(order.createdAt), 'hh:mm a')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} orders
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PaymentManagement;
