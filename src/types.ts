/*
  Define export interfaces for patient data and IPSS scores
*/

export interface PatientInput {
  // Clinical Data
  BM_BLAST: number;
  HB: number;
  PLT: number;
  ANC?: number;
  AGE?: number;
  // Cytogenetic Data
  del5q: string;
  del7_7q: string;
  del17_17p: string;
  complex: string;
  CYTO_IPSSR: string;
  // Molecular Data
  TP53mut?: string;
  TP53maxvaf?: number;
  TP53loh?: string;
  MLL_PTD?: string;
  FLT3?: string;
  ASXL1?: string;
  CBL?: string;
  DNMT3A?: string;
  ETV6?: string;
  EZH2?: string;
  IDH2?: string;
  KRAS?: string;
  NPM1?: string;
  NRAS?: string;
  RUNX1?: string;
  SF3B1?: string;
  SRSF2?: string;
  U2AF1?: string;
  BCOR?: string;
  BCORL1?: string;
  CEBPA?: string;
  ETNK1?: string;
  GATA2?: string;
  GNB1?: string;
  IDH1?: string;
  NF1?: string;
  PHF6?: string;
  PPM1D?: string;
  PRPF8?: string;
  PTPN11?: string;
  SETBP1?: string;
  STAG2?: string;
  WT1?: string;
  // Intermediate Variables
  Nres2: {[key: string]: number};
  SF3B1_5q?: string;
  SF3B1_alpha?: string;
  TP53multi?: string;
  HB1?: number;
  TRANSF_PLT100?: number;
  BLAST5?: number;
  CYTOVEC?: number;
}

/*
  IPSS-R types
*/

interface PatientForIpssrWithCytoNumber {
  // Clinical Data needed to compute Ippsr (Age is optional)
  bmblast: number;
  hb: number;
  plt: number;
  anc: number;
  age?: number;
  cytovec: number;
  cytoIpssr?: string;
}
interface PatientForIpssrWithCytoString {
  // Clinical Data needed to compute Ippsr (Age is optional)
  bmblast: number;
  hb: number;
  plt: number;
  anc: number;
  age?: number;
  cytovec?: number;
  cytoIpssr: string;
}

export type PatientForIpssr = PatientForIpssrWithCytoNumber | PatientForIpssrWithCytoString;

/*
  IPSS-M types
*/

interface IpssmScore {
  riskScore: number;
  riskCat: string;
  contributions: {[key: string]: number};
}

export interface IpssmScores {
  means: IpssmScore;
  best: IpssmScore;
  worst: IpssmScore;
}

/*
  Output  of Annotated Patient Types
*/

export interface PatientWithIpssr {
  // IPSS-R Risk Score
  IPSSR_SCORE?: number;
  IPSSR_CAT?: string;
  // IPSS-RA Risk Score Age-Adjusted (Optional)
  IPSSRA_SCORE?: number | null;
  IPSSRA_CAT?: string | null;
}

export interface PatientWithIpssm {
  // IPSS-M Risk Score: Mean, Best, Worst
  IPSSM_SCORE: number;
  IPSSM_CAT: string;
  IPSSM_SCORE_BEST: number;
  IPSSM_CAT_BEST: string;
  IPSSM_SCORE_WORST: number;
  IPSSM_CAT_WORST: string;
}

export interface PatientOutput extends PatientInput, PatientWithIpssr, PatientWithIpssm {}

/*
  Other types
*/

export interface BetaRiskScore {
  name: string;
  coeff: number;
  means: number;
  worst: number;
  best: number;
}

export interface CsvData {
  [key: string]: number | string
}

export interface FieldDefinition {
  label: string;
  category: string;
  type: string;
  required: boolean;
  default?: number | string;
  varName:string;
  units?: string;
  min?: number;
  max?: number;
  values?: any[];
  notes?: string;
  allowNull?: boolean;
}
