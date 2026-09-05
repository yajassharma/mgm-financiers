import { PipelineStage, Model, FilterQuery } from 'mongoose';
import { escapeRegex } from './regex.helper';

interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number; // Override default max limit (default: 100)
  searchField?: string; // e.g. "title"
  search?: string;
  sort?: Record<string, 1 | -1>;
}

const DEFAULT_MAX_LIMIT = 100;
const ABSOLUTE_MAX_LIMIT = 1000;

export async function paginate<T>(
  model: Model<T>,
  query: FilterQuery<T> = {},
  options: PaginationOptions = {},
  pipeline: PipelineStage[] = [], // optional aggregation pipeline
) {
  const page = Math.max(Number(options.page) || 1, 1);
  const maxLimit = Math.min(Number(options.maxLimit) || DEFAULT_MAX_LIMIT, ABSOLUTE_MAX_LIMIT);
  const limit = Math.min(Math.max(Number(options.limit) || 10, 1), maxLimit);
  const skip = (page - 1) * limit;
  const sort = options.sort || { _id: -1 };

  // add search filter if needed
  if (options.search && options.searchField) {
    const safeSearch = escapeRegex(options.search);
    query = {
      ...query,
      [options.searchField]: { $regex: safeSearch, $options: 'i' },
    };
  }

  let items: any[];
  let total: number;

  if (pipeline.length > 0) {
    // Use aggregation pipeline
    const aggregation = [
      { $match: query },
      ...pipeline,
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const result = await model.aggregate(aggregation).exec();
    items = result[0].items;
    total = result[0].total[0]?.count || 0;
  } else {
    // Use normal query
    [items, total] = await Promise.all([
      model.find(query).sort(sort).skip(skip).limit(limit).exec(),
      model.countDocuments(query),
    ]);
  }

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
