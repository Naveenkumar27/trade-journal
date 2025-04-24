'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useTradeContext } from '@/contexts/trade-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

// Open positions & total invested
export default function PositionsPage() {
  const { getOpenPositions, loading } = useTradeContext();
  const positions = getOpenPositions();
  const [filter, setFilter] = useState('');

  // Filter positions based on user input
  const filteredPositions = positions.filter(
    (pos) =>
      pos.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      pos.stock_name.toLowerCase().includes(filter.toLowerCase())
  );

  // Calculate total invested capital for displayed positions
  const totalInvested = filteredPositions.reduce((acc, pos) => acc + pos.invested, 0);

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col p-4 lg:p-6 gap-4'>
          {/* Gesamtwert offener Positionen */}
          <Card className='mx-4 lg:mx-6'>
            <CardHeader>
              <CardTitle>Gesamtwert offener Positionen</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className='h-6 w-32' />
              ) : (
                <p className='text-2xl font-semibold'>
                  €{totalInvested.toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Filter und Positionsliste */}
          <Card className='mx-4 lg:mx-6'>
            <CardHeader>
              <Input
                placeholder='Filtern nach Symbol oder Name'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className='w-60'
              />
            </CardHeader>
            <CardContent className='overflow-x-auto'>
              {loading ? (
                <Skeleton className='h-64 w-full rounded-md' />
              ) : filteredPositions.length === 0 ? (
                <p className='text-muted-foreground'>
                  Keine offenen Positionen entsprechen diesem Filter.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Aktienname</TableHead>
                      <TableHead>Menge</TableHead>
                      <TableHead>Ø Kaufpreis (€)</TableHead>
                      <TableHead>Investierter Betrag (€)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPositions.map((pos) => (
                      <TableRow key={pos.symbol}>
                        <TableCell>{pos.symbol}</TableCell>
                        <TableCell>{pos.stock_name}</TableCell>
                        <TableCell>{pos.quantity}</TableCell>
                        <TableCell>{pos.avg_price.toFixed(2)}</TableCell>
                        <TableCell>{pos.invested.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
