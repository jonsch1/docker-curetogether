export interface Graph {
    nodes: Node[];
    links: Edge[];
  }
  export interface Node {
    id: string;
    uniprot_data?: UniprotData;
    Drugcentral_data?: DrugcentralData;
    Drugbank_data?: DrugbankData;
  }
  
  
  export interface UniprotData {
    Entry: string;
    "Entry Name": string;
    "Protein names": string;
    "Function [CC]"?: string;
    "Subcellular location [CC]"?: string;
    "Gene Names (primary)": string;
    "Gene Names (synonym)"?: string;
  }
  
  export interface DrugcentralData {
    GENE: string;
    TARGET_CLASS: string;
    TARGET_NAME: string;
    DRUG_NAME: string[];
    ACT_COMMENT: string | undefined[];
    ACTION_TYPE: string | undefined[];
    ACT_SOURCE: string[];
  }
  
  export interface DrugbankData {
    "DrugBank ID": string[];
    Name: string[];
    Type: string[];
    "Gene Symbol": string;
  }
  
  export interface Edge {
    source: string;
    target: string;
    Omnipath_PPI_data?: OmnipathPpiData;
    Omnipath_Enzyme_PTM_data?: OmnipathEnzymePtmData;
    combined_score?: number;
  }
  
  export interface OmnipathEnzymePtmData {
    sources: string[];
    references_stripped: string[];
    direction: string[];
    modification: string;
  }
  
  export interface OmnipathPpiData {
    sources: string[];
    references_stripped: string[];
    direction: string[];
    consensus_direction: boolean;
    consensus_inhibition: boolean;
    consensus_stimulation: boolean;
    is_directed: boolean;
  }
