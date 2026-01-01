import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { CompanyContactResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';

export class CompanyContactMapper {
  static toResponse(contact: CompanyContact): CompanyContactResponseDto {
    return {
      id: contact.id,
      email: contact.email || '',
      phone: contact.phone || '',
      twitter_link: contact.twitterLink || '',
      facebook_link: contact.facebookLink || '',
      linkedin: contact.linkedin || '',
    };
  }

  static toResponseList(contacts: CompanyContact[]): CompanyContactResponseDto[] {
    return contacts.map((contact) => this.toResponse(contact));
  }
}



