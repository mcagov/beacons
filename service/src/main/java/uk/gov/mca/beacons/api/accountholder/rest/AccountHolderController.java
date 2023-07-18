package uk.gov.mca.beacons.api.accountholder.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uk.gov.mca.beacons.api.accountholder.application.AccountHolderService;
import uk.gov.mca.beacons.api.accountholder.application.MicrosoftGraphClient;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolderId;
import uk.gov.mca.beacons.api.accountholder.mappers.AccountHolderMapper;
import uk.gov.mca.beacons.api.beacon.rest.BeaconDTO;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.exceptions.ResourceNotFoundException;

@Slf4j
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
  public ResponseEntity<WrapperDTO<AccountHolderDTO>> getAccountHolder(
    @PathVariable("id") UUID id
  ) {
    final AccountHolderId accountHolderId = new AccountHolderId(id);
    final AccountHolder accountHolder = accountHolderService
      .getAccountHolder(accountHolderId)
      .orElseThrow(ResourceNotFoundException::new);

    return ResponseEntity.ok(accountHolderMapper.toWrapperDTO(accountHolder));
  }

  @GetMapping(value = "/{id}/beacons")
  public ResponseEntity<List<BeaconDTO>> getBeaconsForAccountHolderId(
    @PathVariable("id") UUID id
  ) {
    final AccountHolderId accountHolderId = new AccountHolderId(id);
    List<BeaconDTO> beacons = accountHolderService.getBeaconsByAccountHolderId(
      accountHolderId
    );

    return ResponseEntity.ok(beacons);
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
  ) throws Exception {
    final AccountHolder accountHolderUpdate = accountHolderMapper.fromDTO(
      wrapperDTO.getData()
    );

    final AccountHolder accountHolder = accountHolderService
      .updateAccountHolder(new AccountHolderId(id), accountHolderUpdate)
      .orElseThrow(ResourceNotFoundException::new);

    return accountHolderMapper.toWrapperDTO(accountHolder);
  }
}
