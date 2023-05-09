package uk.gov.mca.beacons.api.search.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import uk.gov.mca.beacons.api.search.domain.AccountHolderSearchEntity;

/**
 * This {@link RepositoryRestResource} exposes controller endpoints to enable searching across account holder records using JPA's built in pagination/sorting capability.
 * <p>
 * See the docs: https://docs.spring.io/spring-data/rest/docs/current/reference/html/#reference for more info
 */
@RepositoryRestResource(
  path = "account-holder-search",
  collectionResourceRel = "accountHolderSearch"
)
@Tag(name = "AccountHolderSearch")
interface AccountHolderSearchRestRepository
  extends JpaRepository<AccountHolderSearchEntity, UUID> {
  @RestResource(path = "find-all", rel = "findAllAccountHolders")
  @Query("SELECT ah FROM AccountHolderSearchEntity ah")
  List<AccountHolderSearchEntity> findAllAccountHolders();
}
