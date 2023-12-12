export interface FieldDefinition {
  label: string;
  category: string;
  type: string;
  required: boolean;
  varName: string;
  varNameIpssR: string;
  units?: string;
  min?: number;
  max?: number;
  values?: string[];
  notes?: string;
  allowNull?: boolean;
}

export const fieldsDefinitions = [
  // Clinical
  {
    label: 'Bone Marrow Blasts',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'BM_BLAST',
    varNameIpssR: 'bmblast',
    units: '%',
    min: 0,
    max: 30,
  },
  {
    label: 'Hemoglobin',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'HB',
    varNameIpssR: 'hb',
    units: ' g/dl',
    min: 4,
    max: 20,
    notes:
      'Useful conversion for Hb values: 10 g/dL= 6.2 mmol/L, 8 g/dL= 5.0 mmol/L',
  },
  {
    label: 'Platelet Count',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'PLT',
    varNameIpssR: 'plt',
    units: ' 1e9/l',
    min: 0,
    max: 2000,
  },
  {
    label: 'Neutrophil Count',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'ANC',
    varNameIpssR: 'anc',
    verboseLabel: 'Absolute Neutrophil Count',
    min: 0,
    max: 15,
    units: ' 1e9/l',
    notes: 'Only needed to calculate IPSS-R',
  },
  {
    label: 'Age',
    category: 'clinical',
    type: 'number',
    required: false,
    varName: 'AGE',
    varNameIpssR: 'age',
    units: ' years',
    min: 18,
    max: 120,
    notes: 'Only needed to calculate age-adjusted IPSS-R',
    allowNull: true,
  },
  // Cytogenetics
  {
    label: 'Cytogenetics Category',
    category: 'cytogenetics',
    type: 'string',
    required: true,
    varName: 'CYTO_IPSSR',
    varNameIpssR: 'cytoIpssr',
    values: [
      'Very Good',
      'Good',
      'Intermediate',
      'Poor',
      'Very Poor',
    ]
  }
]