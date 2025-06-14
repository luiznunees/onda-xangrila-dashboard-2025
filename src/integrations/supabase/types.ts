export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: number
          nome: string
          senha: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          nome: string
          senha: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          nome?: string
          senha?: string
        }
        Relationships: []
      }
      confirmados: {
        Row: {
          bairro: string | null
          cidade: string | null
          created_at: string | null
          id: string
          idade: number | null
          nome_completo: string | null
          nome_responsavel: string | null
          Status: string | null
          telefone_responsavel: string | null
          updated_at: string | null
        }
        Insert: {
          bairro?: string | null
          cidade?: string | null
          created_at?: string | null
          id: string
          idade?: number | null
          nome_completo?: string | null
          nome_responsavel?: string | null
          Status?: string | null
          telefone_responsavel?: string | null
          updated_at?: string | null
        }
        Update: {
          bairro?: string | null
          cidade?: string | null
          created_at?: string | null
          id?: string
          idade?: number | null
          nome_completo?: string | null
          nome_responsavel?: string | null
          Status?: string | null
          telefone_responsavel?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fichas_apoio: {
        Row: {
          arroba_instagram: string | null
          created_at: string | null
          data_nascimento: string
          equipe_trabalho: string
          id: string
          ja_fez_onda: boolean | null
          medicamento_qual: string | null
          nome: string
          nome_responsavel: string | null
          onda_numero: number | null
          onda_onde: string | null
          tamanho_camiseta: string
          telefone_responsavel: string | null
          tem_instagram: boolean | null
          toma_medicamento_continuo: boolean | null
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          arroba_instagram?: string | null
          created_at?: string | null
          data_nascimento: string
          equipe_trabalho: string
          id?: string
          ja_fez_onda?: boolean | null
          medicamento_qual?: string | null
          nome: string
          nome_responsavel?: string | null
          onda_numero?: number | null
          onda_onde?: string | null
          tamanho_camiseta: string
          telefone_responsavel?: string | null
          tem_instagram?: boolean | null
          toma_medicamento_continuo?: boolean | null
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          arroba_instagram?: string | null
          created_at?: string | null
          data_nascimento?: string
          equipe_trabalho?: string
          id?: string
          ja_fez_onda?: boolean | null
          medicamento_qual?: string | null
          nome?: string
          nome_responsavel?: string | null
          onda_numero?: number | null
          onda_onde?: string | null
          tamanho_camiseta?: string
          telefone_responsavel?: string | null
          tem_instagram?: boolean | null
          toma_medicamento_continuo?: boolean | null
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      fichas_marujos: {
        Row: {
          arroba_instagram: string | null
          created_at: string | null
          data_nascimento: string
          equipe_trabalho: string
          id: string
          medicamento_qual: string | null
          nome: string
          nome_responsavel: string | null
          onda_numero: number
          onda_onde: string
          tamanho_camiseta: string
          telefone_responsavel: string | null
          tem_instagram: boolean | null
          toma_medicamento_continuo: boolean | null
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          arroba_instagram?: string | null
          created_at?: string | null
          data_nascimento: string
          equipe_trabalho: string
          id?: string
          medicamento_qual?: string | null
          nome: string
          nome_responsavel?: string | null
          onda_numero: number
          onda_onde: string
          tamanho_camiseta: string
          telefone_responsavel?: string | null
          tem_instagram?: boolean | null
          toma_medicamento_continuo?: boolean | null
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          arroba_instagram?: string | null
          created_at?: string | null
          data_nascimento?: string
          equipe_trabalho?: string
          id?: string
          medicamento_qual?: string | null
          nome?: string
          nome_responsavel?: string | null
          onda_numero?: number
          onda_onde?: string
          tamanho_camiseta?: string
          telefone_responsavel?: string | null
          tem_instagram?: boolean | null
          toma_medicamento_continuo?: boolean | null
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      fichas_surfistas: {
        Row: {
          alergia: string | null
          arroba_instagram: string | null
          comprovante_url: string | null
          created_at: string | null
          data_nascimento: string
          endereco_completo_surfista: string
          escola_serie_ano: string
          fez_crisma: string
          fez_primeira_comunhao: string
          fobia: string | null
          foto_url: string | null
          id: string
          informacao_adicional_surfista: string | null
          instrumento: string | null
          irmaos: string | null
          medicamento: string | null
          nome_mae: string
          nome_pai: string
          nome_surfista: string
          rg_cpf_surfista: string | null
          status_inscricao: string | null
          status_pagamento: string | null
          tamanho_camiseta_surfista: string
          telefone_mae: string
          telefone_pai: string
          telefone_surfista: string
          tipo_pagamento: string | null
          updated_at: string | null
        }
        Insert: {
          alergia?: string | null
          arroba_instagram?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_nascimento: string
          endereco_completo_surfista: string
          escola_serie_ano: string
          fez_crisma: string
          fez_primeira_comunhao: string
          fobia?: string | null
          foto_url?: string | null
          id?: string
          informacao_adicional_surfista?: string | null
          instrumento?: string | null
          irmaos?: string | null
          medicamento?: string | null
          nome_mae: string
          nome_pai: string
          nome_surfista: string
          rg_cpf_surfista?: string | null
          status_inscricao?: string | null
          status_pagamento?: string | null
          tamanho_camiseta_surfista: string
          telefone_mae: string
          telefone_pai: string
          telefone_surfista: string
          tipo_pagamento?: string | null
          updated_at?: string | null
        }
        Update: {
          alergia?: string | null
          arroba_instagram?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_nascimento?: string
          endereco_completo_surfista?: string
          escola_serie_ano?: string
          fez_crisma?: string
          fez_primeira_comunhao?: string
          fobia?: string | null
          foto_url?: string | null
          id?: string
          informacao_adicional_surfista?: string | null
          instrumento?: string | null
          irmaos?: string | null
          medicamento?: string | null
          nome_mae?: string
          nome_pai?: string
          nome_surfista?: string
          rg_cpf_surfista?: string | null
          status_inscricao?: string | null
          status_pagamento?: string | null
          tamanho_camiseta_surfista?: string
          telefone_mae?: string
          telefone_pai?: string
          telefone_surfista?: string
          tipo_pagamento?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inscricoes: {
        Row: {
          "Carimbo de data/hora": string | null
          "Document Merge Status - FICHA 2023": string | null
          "E o telefone do Surfista? Vamos precisar manter contato.":
            | string
            | null
          "Em que escola e série/ano o Surfista estuda?": string | null
          "Fez 1ª  comunhão": string | null
          "Fez a Crisma?": string | null
          "Link to merged Doc - FICHA 2023": string | null
          "Merged Doc ID - FICHA 2023": string | null
          "Merged Doc URL - FICHA 2023": string | null
          "Nome da Mãe:": string | null
          "Nome do Pai:": string | null
          "O Surfista tem alguma alergia? Qual?": string | null
          "O Surfista tem alguma fobia (medo)? Qual": string | null
          "O Surfista tem irmãos? Quantos?": string | null
          "O Surfista toca algum Instrumento": string | null
          "O Surfista toma algum medicamento de uso contínuo? Qual? Em qu":
            | string
            | null
          "Qual o endereço completo do Surfista? Bairro e cidade também,":
            | string
            | null
          "Qual o nome do Surfista?": string | null
          "Qual o nome que vocês querem que apareça no crachá do Surfis":
            | string
            | null
          "Qual o número do RG ou CPF do Surfista?": string | null
          "Qual o tamanho da camiseta do Surfista?": string | null
          "Quando foi que o Surfista nasceu?": string | null
          "Se quiser, pode adicionar alguma informação adicional que ach":
            | string
            | null
          "Telefone da Mãe": string | null
          "Telefone da Pai": string | null
          WhatsApp: number | null
        }
        Insert: {
          "Carimbo de data/hora"?: string | null
          "Document Merge Status - FICHA 2023"?: string | null
          "E o telefone do Surfista? Vamos precisar manter contato."?:
            | string
            | null
          "Em que escola e série/ano o Surfista estuda?"?: string | null
          "Fez 1ª  comunhão"?: string | null
          "Fez a Crisma?"?: string | null
          "Link to merged Doc - FICHA 2023"?: string | null
          "Merged Doc ID - FICHA 2023"?: string | null
          "Merged Doc URL - FICHA 2023"?: string | null
          "Nome da Mãe:"?: string | null
          "Nome do Pai:"?: string | null
          "O Surfista tem alguma alergia? Qual?"?: string | null
          "O Surfista tem alguma fobia (medo)? Qual"?: string | null
          "O Surfista tem irmãos? Quantos?"?: string | null
          "O Surfista toca algum Instrumento"?: string | null
          "O Surfista toma algum medicamento de uso contínuo? Qual? Em qu"?:
            | string
            | null
          "Qual o endereço completo do Surfista? Bairro e cidade também,"?:
            | string
            | null
          "Qual o nome do Surfista?"?: string | null
          "Qual o nome que vocês querem que apareça no crachá do Surfis"?:
            | string
            | null
          "Qual o número do RG ou CPF do Surfista?"?: string | null
          "Qual o tamanho da camiseta do Surfista?"?: string | null
          "Quando foi que o Surfista nasceu?"?: string | null
          "Se quiser, pode adicionar alguma informação adicional que ach"?:
            | string
            | null
          "Telefone da Mãe"?: string | null
          "Telefone da Pai"?: string | null
          WhatsApp?: number | null
        }
        Update: {
          "Carimbo de data/hora"?: string | null
          "Document Merge Status - FICHA 2023"?: string | null
          "E o telefone do Surfista? Vamos precisar manter contato."?:
            | string
            | null
          "Em que escola e série/ano o Surfista estuda?"?: string | null
          "Fez 1ª  comunhão"?: string | null
          "Fez a Crisma?"?: string | null
          "Link to merged Doc - FICHA 2023"?: string | null
          "Merged Doc ID - FICHA 2023"?: string | null
          "Merged Doc URL - FICHA 2023"?: string | null
          "Nome da Mãe:"?: string | null
          "Nome do Pai:"?: string | null
          "O Surfista tem alguma alergia? Qual?"?: string | null
          "O Surfista tem alguma fobia (medo)? Qual"?: string | null
          "O Surfista tem irmãos? Quantos?"?: string | null
          "O Surfista toca algum Instrumento"?: string | null
          "O Surfista toma algum medicamento de uso contínuo? Qual? Em qu"?:
            | string
            | null
          "Qual o endereço completo do Surfista? Bairro e cidade também,"?:
            | string
            | null
          "Qual o nome do Surfista?"?: string | null
          "Qual o nome que vocês querem que apareça no crachá do Surfis"?:
            | string
            | null
          "Qual o número do RG ou CPF do Surfista?"?: string | null
          "Qual o tamanho da camiseta do Surfista?"?: string | null
          "Quando foi que o Surfista nasceu?"?: string | null
          "Se quiser, pode adicionar alguma informação adicional que ach"?:
            | string
            | null
          "Telefone da Mãe"?: string | null
          "Telefone da Pai"?: string | null
          WhatsApp?: number | null
        }
        Relationships: []
      }
      pre_inscricoes: {
        Row: {
          bairro: string
          cidade: string
          created_at: string | null
          id: string
          idade: number
          nome_completo: string
          nome_responsavel: string
          Status: string | null
          telefone_responsavel: string
          updated_at: string | null
        }
        Insert: {
          bairro: string
          cidade: string
          created_at?: string | null
          id?: string
          idade: number
          nome_completo: string
          nome_responsavel: string
          Status?: string | null
          telefone_responsavel: string
          updated_at?: string | null
        }
        Update: {
          bairro?: string
          cidade?: string
          created_at?: string | null
          id?: string
          idade?: number
          nome_completo?: string
          nome_responsavel?: string
          Status?: string | null
          telefone_responsavel?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string | null
          id: string
          nome_completo: string
          permissao: Database["public"]["Enums"]["permissao_tipo"]
          primeiro_login: boolean
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          nome_completo: string
          permissao?: Database["public"]["Enums"]["permissao_tipo"]
          primeiro_login?: boolean
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_completo?: string
          permissao?: Database["public"]["Enums"]["permissao_tipo"]
          primeiro_login?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      permissao_tipo: "supreme" | "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      permissao_tipo: ["supreme", "admin", "user"],
    },
  },
} as const
