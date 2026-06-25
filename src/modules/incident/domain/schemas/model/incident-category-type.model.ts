export class IncidentCategoryModel {
  categoryId!: number;
  categoryCode!: string;
  categoryName!: string;
  categoryDescription!: string;
  incidentTypes!: IncidentTypeModel[];
}

export class IncidentTypeModel {
  typeCode!: string;
  typeName!: string;
  typeDescription!: string;
  suggestedPriority!: boolean;
}
