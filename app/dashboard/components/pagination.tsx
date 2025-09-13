'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPreviousPage,
  onNextPage,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
      <div className="text-muted-foreground flex items-center text-sm">
        <span>
          Mostrando <span className="font-medium">{startItem}</span> até{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> resultados
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          ← Anterior
        </Button>

        <div className="flex items-center space-x-1">
          {/* First page */}
          {currentPage > 3 && (
            <>
              <Button
                onClick={() => onPageChange(1)}
                variant={currentPage === 1 ? 'default' : 'outline'}
                size="sm"
                className="h-10 w-10"
              >
                1
              </Button>
              {currentPage > 4 && (
                <span className="text-muted-foreground px-2">...</span>
              )}
            </>
          )}

          {/* Current page and neighbors */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            if (pageNum < 1 || pageNum > totalPages) return null;
            if (totalPages > 5 && currentPage > 3 && pageNum === 1) return null;
            if (
              totalPages > 5 &&
              currentPage < totalPages - 2 &&
              pageNum === totalPages
            )
              return null;

            return (
              <Button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                className="h-10 w-10"
              >
                {pageNum}
              </Button>
            );
          })}

          {/* Last page */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="text-muted-foreground px-2">...</span>
              )}
              <Button
                onClick={() => onPageChange(totalPages)}
                variant={currentPage === totalPages ? 'default' : 'outline'}
                size="sm"
                className="h-10 w-10"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          Próximo →
        </Button>
      </div>
    </div>
  );
};
