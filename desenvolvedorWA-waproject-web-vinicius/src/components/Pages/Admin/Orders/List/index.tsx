import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import SearchField from 'components/Shared/Pagination/SearchField';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import usePaginationObservable from 'hooks/usePagination';
import IOrder from 'interfaces/models/order';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { useCallback, useState } from 'react';
import orderService from 'services/order';

import FormDialog from '../FormDialog';
import ListItem from './ListItem';

const OrderList: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>(null);

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => orderService.list(params),
    { orderBy: 'description', orderDirection: 'asc' },
    []
  );

  const handleCreate = useCallback(() => {
    setSelectedOrder(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((order: IOrder) => {
    setSelectedOrder(order);
    setFormOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const onDeleteComplete = useCallback(() => {
    refresh();
  }, [refresh]);

  const formCallback = useCallback(
    (order: IOrder) => {
      setFormOpen(false);
      if (!selectedOrder) {
        mergeParams({ ...params, term: String(order.id) });
      } else {
        refresh();
      }
    },
    [params, mergeParams, selectedOrder, refresh]
  );

  const formCancel = useCallback(() => {
    setFormOpen(false);
    setSelectedOrder(null);
  }, []);

  return (
    <>
      <Toolbar title='Pedidos' />
      <Card>
        <FormDialog open={formOpen} order={selectedOrder} onComplete={formCallback} onCancel={formCancel} />
        <CardLoader show={loading} />
        <CardContent>
          <Grid container spacing={2} justify='space-between' alignItems='center'>
            <Grid item xs={12} sm={8} lg={8}>
              <SearchField paginationParams={params} onChange={mergeParams} />
            </Grid>
            <Grid item xs={12} sm={'auto'}>
              <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
          <TableWrapper minWidth={500}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellSortable
                    column='description'
                    disabled={loading}
                    onChange={mergeParams}
                    paginationParams={params}
                  >
                    Descrição
                  </TableCellSortable>
                  <TableCellSortable
                    column='quantity'
                    disabled={loading}
                    onChange={mergeParams}
                    paginationParams={params}
                  >
                    Quantidade
                  </TableCellSortable>
                  <TableCellSortable column='value' disabled={loading} onChange={mergeParams} paginationParams={params}>
                    Valor
                  </TableCellSortable>
                  <TableCellActions>
                    <IconButton disabled={loading} onClick={handleRefresh}>
                      <RefreshIcon />
                    </IconButton>
                  </TableCellActions>
                </TableRow>
              </TableHead>
              <TableBody>
                <EmptyAndErrorMessages
                  colSpan={6}
                  error={error}
                  loading={loading}
                  onTryAgain={refresh}
                  hasData={data?.results.length > 0}
                />
                {data?.results.map(order => (
                  <ListItem key={order.id} order={order} handleEdit={handleEdit} onDeleteComplete={onDeleteComplete} />
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
          <TablePagination
            total={data?.total || 0}
            disabled={loading}
            paginationParams={params}
            onChange={mergeParams}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default React.memo(OrderList);
