package uk.gov.mca.beacons.api.accountholder.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.mappers.AccountHolderMapper;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;

@RestController
@RequestMapping("/spring-api/account-holder")
@Tag(name = "Account Holder")
public class AccountHolderController {

  private final AccountHolderService accountHolderService;
  private final AccountHolderMapper accountHolderMapper;

  @Autowired
  public AccountHolderController(
    AccountHolderService accountHolderService,
    AccountHolderMapper accountHolderMapper
  ) {
    this.accountHolderMapper = accountHolderMapper;
    this.accountHolderService = accountHolderService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public WrapperDTO<AccountHolderDTO> createAccountHolder(
    @RequestBody WrapperDTO<AccountHolderDTO> wrapperDTO
  ) {
    final AccountHolder accountHolder = accountHolderMapper.fromDTO(
      wrapperDTO.getData()
    );
    final AccountHolder createdAccountHolder = accountHolderService.create(
      accountHolder
    );

    return accountHolderMapper.toWrapperDTO(createdAccountHolder);
  }

  @GetMapping(value = "/{id}")
  public WrapperDTO<AccountHolderDTO> getAccountHolder(
    @PathVariable("id") UUID id
  ) {
    final AccountHolderId accountHolderId = new AccountHolderId(id);
    final AccountHolder accountHolder = accountHolderService
      .getAccountHolder(accountHolderId)
      .orElseThrow(ResourceNotFoundException::new);

    return accountHolderMapper.toWrapperDTO(accountHolder);
  }

  @GetMapping
  public WrapperDTO<AccountHolderDTO> getAccountHolderByAuthId(
    @RequestParam(name = "authId") String authId
  ) {
    final AccountHolder accountHolder = accountHolderService
      .getAccountHolderByAuthId(authId)
      .orElseThrow(ResourceNotFoundException::new);

    return accountHolderMapper.toWrapperDTO(accountHolder);
  }

  @PatchMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize("hasAuthority('APPROLE_UPDATE_RECORDS')")
  public WrapperDTO<AccountHolderDTO> updateAccountHolderDetails(
    @PathVariable UUID id,
    @RequestBody WrapperDTO<UpdateAccountHolderDTO> wrapperDTO
  ) {
    final AccountHolder accountHolderUpdate = accountHolderMapper.fromDTO(
      wrapperDTO.getData()
    );

    final AccountHolder accountHolder = accountHolderService
      .updateAccountHolder(new AccountHolderId(id), accountHolderUpdate)
      .orElseThrow(ResourceNotFoundException::new);

    return accountHolderMapper.toWrapperDTO(accountHolder);
  }
}
