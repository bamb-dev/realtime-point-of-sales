import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function PaginationDataTable({
  currentPage,
  totalPages,
  onChangePage,
}: {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button variant="ghost" className="px-0">
            <PaginationPrevious
              onClick={() => {
                if (currentPage > 1) onChangePage(currentPage - 1);
                else onChangePage(totalPages);
              }}
            />
          </Button>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          if (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          ) {
            return (
              <PaginationItem key={page}>
                <Button variant="ghost" className="px-0">
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => {
                      if (page !== currentPage) onChangePage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </Button>
              </PaginationItem>
            );
          }

          if (
            (page === currentPage - 2 && page > 1) ||
            (page === currentPage + 2 && page < totalPages)
          ) {
            return (
              <PaginationItem key={`illipsis-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
        })}
        <PaginationItem>
          <Button variant="ghost" className="px-0">
            <PaginationNext
              onClick={() => {
                if (currentPage < totalPages) onChangePage(currentPage + 1);
                else onChangePage(1);
              }}
            />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
