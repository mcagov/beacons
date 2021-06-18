export interface IApiResponse {
  meta: Record<string, any>;
  data: Record<string, any> | Record<string, any>[];
  included: {
    type: string;
    id: string;
    attributes: Record<string, any>;
    links: { verb: string; path: string }[];
  }[];
}
