package uk.gov.mca.beacons.api.accountholder.mappers;

import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.mca.beacons.api.accountholder.domain.AccountHolder;
import uk.gov.mca.beacons.api.accountholder.rest.AccountHolderDTO;
import uk.gov.mca.beacons.api.accountholder.rest.UpdateAccountHolderDTO;
import uk.gov.mca.beacons.api.dto.WrapperDTO;
import uk.gov.mca.beacons.api.shared.mappers.person.AddressMapper;

@Component("AccountHolderMapperV2")
public class AccountHolderMapper {

  private final AddressMapper addressMapper;

  @Autowired
  public AccountHolderMapper(AddressMapper addressMapper) {
    this.addressMapper = addressMapper;
  }

  public AccountHolder fromDTO(AccountHolderDTO accountHolderDTO) {
    final var attributes = accountHolderDTO.getAttributes();

    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setAuthId(attributes.getAuthId());
    accountHolder.setEmail(attributes.getEmail());
    accountHolder.setFullName(attributes.getFullName());
    accountHolder.setTelephoneNumber(attributes.getTelephoneNumber());
    accountHolder.setAlternativeTelephoneNumber(
      attributes.getAlternativeTelephoneNumber()
    );
    accountHolder.setAddress(addressMapper.fromDTO(attributes.getAddressDTO()));

    return accountHolder;
  }

  public AccountHolder fromDTO(UpdateAccountHolderDTO dto) {
    final var attributes = dto.getAttributes();
    AccountHolder accountHolder = new AccountHolder();
    accountHolder.setFullName(attributes.getFullName());
    accountHolder.setEmail(attributes.getEmail());
    accountHolder.setTelephoneNumber(attributes.getTelephoneNumber());
    accountHolder.setAlternativeTelephoneNumber(
      attributes.getAlternativeTelephoneNumber()
    );
    accountHolder.setAddress(addressMapper.fromDTO(attributes.getAddressDTO()));

    return accountHolder;
  }

  public AccountHolderDTO toDTO(AccountHolder accountHolder) {
    final var dto = new AccountHolderDTO();
    dto.setId(Objects.requireNonNull(accountHolder.getId()).unwrap());

    final var attributes = AccountHolderDTO.Attributes
      .builder()
      .authId(accountHolder.getAuthId())
      .email(accountHolder.getEmail())
      .fullName(accountHolder.getFullName())
      .telephoneNumber(accountHolder.getTelephoneNumber())
      .alternativeTelephoneNumber(accountHolder.getAlternativeTelephoneNumber())
      .addressDTO(addressMapper.toDTO(accountHolder.getAddress()))
      .build();

    dto.setAttributes(attributes);

    return dto;
  }

  public WrapperDTO<AccountHolderDTO> toWrapperDTO(
    AccountHolder accountHolder
  ) {
    final WrapperDTO<AccountHolderDTO> wrapperDTO = new WrapperDTO<>();

    wrapperDTO.setData(toDTO(accountHolder));

    return wrapperDTO;
  }
}
