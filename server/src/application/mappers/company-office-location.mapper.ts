import { CompanyOfficeLocation } from '../../domain/entities/company-office-location.entity';
import { CompanyLocationResponseDto } from '../dto/company/company-response.dto';

export class CompanyOfficeLocationMapper {
  static toResponse(location: CompanyOfficeLocation): CompanyLocationResponseDto {
    return {
      id: location.id,
      location: location.location,
      office_name: location.officeName || '',
      address: location.address || '',
      is_headquarters: location.isHeadquarters,
    };
  }

  static toResponseList(locations: CompanyOfficeLocation[]): CompanyLocationResponseDto[] {
    return locations.map((location) => this.toResponse(location));
  }
}

