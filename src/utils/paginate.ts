import platformConstants from "../configs/platfromContants";
import { IRequest } from "./types";

const { paginationConfig } = platformConstants;
type perPageType = (typeof paginationConfig.allowedPerPageValues)[number];

const handlePaginate = (req: IRequest) => {
  let page: number = Number(req.query.page);

  let per_page: perPageType = (req.query.per_page ||
    paginationConfig.perPage) as perPageType;

  if (paginationConfig.allowedPerPageValues.includes(per_page)) {
    per_page = paginationConfig.perPage as perPageType;
  }

  const paginationData = {
    currentPage: page,
    per_page,
    paginationOption: {
      sort: { _id: -1 },
      skip: page >= 1 ? (page - 1) * per_page : 0,
      limit: per_page,
    },
  };

  const meta = (count: number) => {
    const totalPages: number = Math.ceil(count / per_page);
    const nextPage = page + 1 <= totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return { totalPages, nextPage, prevPage };
  };

  return {
    ...paginationData,
    meta,
  };
};

export default handlePaginate;
