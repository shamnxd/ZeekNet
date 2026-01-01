import { CompanyContact } from '../../../domain/entities/company-contact.entity';
import { CompanyContactResponseDto } from '../../dtos/company/responses/company-response.dto';

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



