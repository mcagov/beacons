export interface IAccountHolderSearchResult {
  // page: {
  //   size: number;
  //   totalElements: number;
  //   totalPages: number;
  //   number: number;
  // };

  _embedded: { accountHolderSearch: IAccountHolderSearchResultData[] };
}

export interface IAccountHolderSearchResultData {
  id: string;
  fullName: string;
  email: string;
  createdDate: string;
  lastModifiedDate: string;
  beaconCount: number;
  _links: {
    self: {
      href: string;
    };
    accountHolderSearchEntity: {
      href: string;
    };
  };
}
