import { FieldDefinition } from '../types'

const fieldsDefinitions: {[key: string]: FieldDefinition} = {
  // Clinical
  'BM_BLAST': {
    label: 'Bone Marrow Blasts',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'BM_BLAST',
    units: '%',
    min: 0,
    max: 30,
  },
  'HB': {
    label: 'Hemoglobin',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'HB',
    units: ' g/dl',
    min: 4,
    max: 20,
    notes:
      'Useful conversion for Hb values: 10 g/dL= 6.2 mmol/L, 8 g/dL= 5.0 mmol/L',
  },
  'PLT': {
    label: 'Platelet Count',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'PLT',
    units: ' 1e9/l',
    min: 0,
    max: 2000,
  },
  'ANC': {
    label: 'Absolute Neutrophil Count',
    category: 'clinical',
    type: 'number',
    required: true,
    varName: 'ANC',
    min: 0,
    max: 15,
    units: ' 1e9/l',
    notes: 'Only needed to calculate IPSS-R',
  },
  'AGE': {
    label: 'Age',
    category: 'clinical',
    type: 'number',
    required: false,
    varName: 'AGE',
    units: ' years',
    min: 18,
    max: 120,
    notes: 'Only needed to calculate age-adjusted IPSS-R',
    allowNull: true,
  },
  // Cytogenetics
  'CYTO_IPSSR': {
    label: 'Cytogenetics Category',
    category: 'cytogenetics',
    type: 'string',
    required: true,
    varName: 'CYTO_IPSSR',
    values: [
      'Very Good',
      'Good',
      'Intermediate',
      'Poor',
      'Very Poor',
    ]
  },
  // Molecular Data
  'TP53mut': {
    label: `Number of TP53 mutations`,
    category: 'molecular',
    type: 'string',
    required: false,
    default: '0',
    varName: 'TP53mut',
    values: [    
      '0',
      '1',
      '2 or more'
    ]
  },
  'TP53maxvaf': {
    label: `Maximum VAF of TP53 mutation(s)`,
    category: 'molecular',
    type: 'number',
    required: false,
    default: 0,
    varName: 'TP53maxvaf',
    units: '%',
    min: 0,
    max: 100,
  },
  'TP53loh': {
    label: `Loss of heterozygosity at TP53 locus`,
    category: 'molecular',
    type: 'string',
    required: false,
    default: 0,
    varName: 'TP53loh',
    values: [    
      0,
      1,
      'NA',
    ]
  },
  'MLL_PTD': {
    label: `MLL <or KMT2A> PTD`,
    category: 'molecular',
    type: 'string',
    required: false,
    default: 0,
    varName: 'MLL_PTD',
    values: [    
      0,
      1,
      'NA',
    ]
  },
  'FLT3': {
    label: `FLT3 ITD or TKD`,
    category: 'molecular',
    type: 'string',
    required: false,
    default: 0,
    varName: 'FLT3',
    values: [    
      0,
      1,
      'NA',
    ]
  },
}


// Cytogenetic Data
const cytogenetics: string[] = [
  'del5q',
  'del7_7q',
  'del17_17p',
  'complex',
]

cytogenetics.forEach((value) => {
  fieldsDefinitions[value] = {
    label: `Presence of ${value}`,
    category: 'molecular',
    type: 'string',
    required: false,
    default: 0,
    varName: value,
    values: [    
      0,
      1,
    ],
  }
})

const genesMain: string[] = [
  'ASXL1',
  'CBL',
  'DNMT3A',
  'ETV6',
  'EZH2',
  'IDH2',
  'KRAS',
  'NPM1',
  'NRAS',
  'RUNX1',
  'SF3B1',
  'SRSF2',
  'U2AF1',
]

const genesResidual: string[] = [
  'BCOR',
  'BCORL1',
  'CEBPA',
  'ETNK1',
  'GATA2',
  'GNB1',
  'IDH1',
  'NF1',
  'PHF6',
  'PPM1D',
  'PRPF8',
  'PTPN11',
  'SETBP1',
  'STAG2',
  'WT1',
]

const genes: string[] = [
  ...genesMain,
  ...genesResidual,
]

genes.forEach((gene) => {
  fieldsDefinitions[gene] = {
    label: gene,
    category: 'molecular',
    type: 'string',
    required: false,
    default: 0,
    varName: gene,
    values: [    
      0,
      1,
      'NA',
    ],
  }
})

// Field Definitions for IPSS-M and IPSS-R
export const ipssmFields: FieldDefinition[] = [
  // Clinical Fields
  fieldsDefinitions['BM_BLAST'],
  fieldsDefinitions['HB'],
  fieldsDefinitions['PLT'],
  // Cytogenetic Fields
  fieldsDefinitions['del5q'],
  fieldsDefinitions['del7_7q'],
  fieldsDefinitions['del17_17p'],
  fieldsDefinitions['complex'],
  fieldsDefinitions['CYTO_IPSSR'],
  // Molecular Fields
  fieldsDefinitions['TP53mut'],
  fieldsDefinitions['TP53maxvaf'],
  fieldsDefinitions['TP53loh'],
  fieldsDefinitions['MLL_PTD'],
  fieldsDefinitions['FLT3'],
  fieldsDefinitions['ASXL1'],
  fieldsDefinitions['CBL'],
  fieldsDefinitions['DNMT3A'],
  fieldsDefinitions['ETV6'],
  fieldsDefinitions['EZH2'],
  fieldsDefinitions['IDH2'],
  fieldsDefinitions['KRAS'],
  fieldsDefinitions['NPM1'],
  fieldsDefinitions['NRAS'],
  fieldsDefinitions['RUNX1'],
  fieldsDefinitions['SF3B1'],
  fieldsDefinitions['SRSF2'],
  fieldsDefinitions['U2AF1'],
  fieldsDefinitions['BCOR'],
  fieldsDefinitions['BCORL1'],
  fieldsDefinitions['CEBPA'],
  fieldsDefinitions['ETNK1'],
  fieldsDefinitions['GATA2'],
  fieldsDefinitions['GNB1'],
  fieldsDefinitions['IDH1'],
  fieldsDefinitions['NF1'],
  fieldsDefinitions['PHF6'],
  fieldsDefinitions['PPM1D'],
  fieldsDefinitions['PRPF8'],
  fieldsDefinitions['PTPN11'],
  fieldsDefinitions['SETBP1'],
  fieldsDefinitions['STAG2'],
  fieldsDefinitions['WT1'],
]

export const ipssrFields: FieldDefinition[] = [
  fieldsDefinitions['BM_BLAST'],
  fieldsDefinitions['HB'],
  fieldsDefinitions['PLT'],
  fieldsDefinitions['ANC'],
  fieldsDefinitions['CYTO_IPSSR'],
  fieldsDefinitions['AGE'],
]