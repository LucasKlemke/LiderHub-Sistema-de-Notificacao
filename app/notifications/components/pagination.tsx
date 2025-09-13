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
    <div className="mt-6 border-t border-neutral-700 pt-6 sm:mt-8">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="mb-4 text-center">
          <span className="text-sm text-neutral-400">
            {startItem}-{endItem} de {totalItems}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <Button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="flex-1 border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
          >
            ← Anterior
          </Button>
          <div className="flex items-center px-3">
            <span className="text-sm text-neutral-300">
              {currentPage} / {totalPages}
            </span>
          </div>
          <Button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="flex-1 border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
          >
            Próximo →
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center text-sm text-neutral-400">
          <span>
            Mostrando{' '}
            <span className="font-medium text-neutral-200">{startItem}</span>{' '}
            até <span className="font-medium text-neutral-200">{endItem}</span>{' '}
            de{' '}
            <span className="font-medium text-neutral-200">{totalItems}</span>{' '}
            resultados
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
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
                  className={`h-10 w-10 ${
                    currentPage === 1
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  1
                </Button>
                {currentPage > 4 && (
                  <span className="px-2 text-neutral-500">...</span>
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
              if (totalPages > 5 && currentPage > 3 && pageNum === 1)
                return null;
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
                  className={`h-10 w-10 ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}

            {/* Last page */}
            {currentPage < totalPages - 2 && totalPages > 5 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-2 text-neutral-500">...</span>
                )}
                <Button
                  onClick={() => onPageChange(totalPages)}
                  variant={currentPage === totalPages ? 'default' : 'outline'}
                  size="sm"
                  className={`h-10 w-10 ${
                    currentPage === totalPages
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white'
                  }`}
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
            className="flex items-center gap-2 border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
          >
            Próximo →
          </Button>
        </div>
      </div>
    </div>
  );
};
