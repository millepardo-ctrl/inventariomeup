export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      asesores: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          nombre: string
          telegram_id: string | null
          telegram_username: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre: string
          telegram_id?: string | null
          telegram_username?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre?: string
          telegram_id?: string | null
          telegram_username?: string | null
        }
        Relationships: []
      }
      availability_blocks: {
        Row: {
          created_at: string
          external_uid: string | null
          fecha_fin: string
          fecha_inicio: string
          id: string
          listing_id: string
          nota: string | null
          origen: Database["public"]["Enums"]["origen_bloqueo"]
        }
        Insert: {
          created_at?: string
          external_uid?: string | null
          fecha_fin: string
          fecha_inicio: string
          id?: string
          listing_id: string
          nota?: string | null
          origen: Database["public"]["Enums"]["origen_bloqueo"]
        }
        Update: {
          created_at?: string
          external_uid?: string | null
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          listing_id?: string
          nota?: string | null
          origen?: Database["public"]["Enums"]["origen_bloqueo"]
        }
        Relationships: [
          {
            foreignKeyName: "availability_blocks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      ical_feeds: {
        Row: {
          activo: boolean
          created_at: string
          fallos_seguidos: number
          id: string
          listing_id: string
          ultimo_error: string | null
          ultimo_sync: string | null
          url: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          fallos_seguidos?: number
          id?: string
          listing_id: string
          ultimo_error?: string | null
          ultimo_sync?: string | null
          url: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          fallos_seguidos?: number
          id?: string
          listing_id?: string
          ultimo_error?: string | null
          ultimo_sync?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ical_feeds_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          activo: boolean
          airbnb_url: string | null
          created_at: string
          descripcion_publica: string | null
          encontrable_url: string | null
          id: string
          min_noches: number | null
          modalidad: Database["public"]["Enums"]["modalidad_listing"]
          moneda: string
          precio: number | null
          property_id: string
          slug: string
          tarifa_limpieza: number | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          airbnb_url?: string | null
          created_at?: string
          descripcion_publica?: string | null
          encontrable_url?: string | null
          id?: string
          min_noches?: number | null
          modalidad: Database["public"]["Enums"]["modalidad_listing"]
          moneda?: string
          precio?: number | null
          property_id: string
          slug: string
          tarifa_limpieza?: number | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          airbnb_url?: string | null
          created_at?: string
          descripcion_publica?: string | null
          encontrable_url?: string | null
          id?: string
          min_noches?: number | null
          modalidad?: Database["public"]["Enums"]["modalidad_listing"]
          moneda?: string
          precio?: number | null
          property_id?: string
          slug?: string
          tarifa_limpieza?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nombre: string
          notas: string | null
          telefono: string | null
          telegram_user_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          nombre: string
          notas?: string | null
          telefono?: string | null
          telegram_user_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          telefono?: string | null
          telegram_user_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          aires: number | null
          banos: number | null
          camas: number | null
          capacidad: number | null
          ciudad: string | null
          ciudad_slug: string | null
          codigo: string
          conjunto: string | null
          created_at: string
          direccion: string | null
          estado: Database["public"]["Enums"]["estado_propiedad"]
          habitaciones: number | null
          id: string
          m2: number | null
          maps_url: string | null
          nombre: string
          notas_internas: string | null
          owner_id: string | null
          parqueaderos: number | null
          piscina: string | null
          revision_pendiente: string[]
          tipo: Database["public"]["Enums"]["tipo_propiedad"]
          updated_at: string
          zona: string | null
          zona_slug: string | null
        }
        Insert: {
          aires?: number | null
          banos?: number | null
          camas?: number | null
          capacidad?: number | null
          ciudad?: string | null
          ciudad_slug?: string | null
          codigo: string
          conjunto?: string | null
          created_at?: string
          direccion?: string | null
          estado?: Database["public"]["Enums"]["estado_propiedad"]
          habitaciones?: number | null
          id?: string
          m2?: number | null
          maps_url?: string | null
          nombre: string
          notas_internas?: string | null
          owner_id?: string | null
          parqueaderos?: number | null
          piscina?: string | null
          revision_pendiente?: string[]
          tipo: Database["public"]["Enums"]["tipo_propiedad"]
          updated_at?: string
          zona?: string | null
          zona_slug?: string | null
        }
        Update: {
          aires?: number | null
          banos?: number | null
          camas?: number | null
          capacidad?: number | null
          ciudad?: string | null
          ciudad_slug?: string | null
          codigo?: string
          conjunto?: string | null
          created_at?: string
          direccion?: string | null
          estado?: Database["public"]["Enums"]["estado_propiedad"]
          habitaciones?: number | null
          id?: string
          m2?: number | null
          maps_url?: string | null
          nombre?: string
          notas_internas?: string | null
          owner_id?: string | null
          parqueaderos?: number | null
          piscina?: string | null
          revision_pendiente?: string[]
          tipo?: Database["public"]["Enums"]["tipo_propiedad"]
          updated_at?: string
          zona?: string | null
          zona_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      property_media: {
        Row: {
          created_at: string
          es_portada: boolean
          id: string
          orden: number
          origen: string
          property_id: string
          storage_path: string | null
          url: string
        }
        Insert: {
          created_at?: string
          es_portada?: boolean
          id?: string
          orden?: number
          origen?: string
          property_id: string
          storage_path?: string | null
          url: string
        }
        Update: {
          created_at?: string
          es_portada?: boolean
          id?: string
          orden?: number
          origen?: string
          property_id?: string
          storage_path?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_private: {
        Row: {
          acceso_notas: string | null
          door_code: string | null
          precio_costo: number | null
          property_id: string
          updated_at: string
          wifi_password: string | null
          wifi_ssid: string | null
        }
        Insert: {
          acceso_notas?: string | null
          door_code?: string | null
          precio_costo?: number | null
          property_id: string
          updated_at?: string
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Update: {
          acceso_notas?: string | null
          door_code?: string | null
          precio_costo?: number | null
          property_id?: string
          updated_at?: string
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_private_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_items: {
        Row: {
          acabado: string | null
          cantidad: number
          codigo: string
          id: string
          m2_unitario: number | null
          referencia: string
          solicitud_id: string
          tipo_pieza: string
        }
        Insert: {
          acabado?: string | null
          cantidad?: number
          codigo: string
          id?: string
          m2_unitario?: number | null
          referencia: string
          solicitud_id: string
          tipo_pieza?: string
        }
        Update: {
          acabado?: string | null
          cantidad?: number
          codigo?: string
          id?: string
          m2_unitario?: number | null
          referencia?: string
          solicitud_id?: string
          tipo_pieza?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_items_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes_muestras"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_muestras: {
        Row: {
          asesor_nombre: string | null
          dest_cedula: string | null
          dest_celular: string | null
          dest_ciudad: string | null
          dest_depto: string | null
          dest_direccion: string | null
          dest_empresa: string | null
          dest_nombre: string | null
          estado: string
          fecha_despacho: string | null
          fecha_solicitud: string | null
          id: string
          origen: string
          telegram_chat_id: string | null
          tipo_envio: string
        }
        Insert: {
          asesor_nombre?: string | null
          dest_cedula?: string | null
          dest_celular?: string | null
          dest_ciudad?: string | null
          dest_depto?: string | null
          dest_direccion?: string | null
          dest_empresa?: string | null
          dest_nombre?: string | null
          estado?: string
          fecha_despacho?: string | null
          fecha_solicitud?: string | null
          id?: string
          origen?: string
          telegram_chat_id?: string | null
          tipo_envio?: string
        }
        Update: {
          asesor_nombre?: string | null
          dest_cedula?: string | null
          dest_celular?: string | null
          dest_ciudad?: string | null
          dest_depto?: string | null
          dest_direccion?: string | null
          dest_empresa?: string | null
          dest_nombre?: string | null
          estado?: string
          fecha_despacho?: string | null
          fecha_solicitud?: string | null
          id?: string
          origen?: string
          telegram_chat_id?: string | null
          tipo_envio?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          activo: boolean
          created_at: string
          nombre: string
          rol: string
          user_id: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          nombre: string
          rol?: string
          user_id: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          nombre?: string
          rol?: string
          user_id?: string
        }
        Relationships: []
      }
      telegram_sessions: {
        Row: {
          chat_id: string
          created_at: string | null
          expires_at: string | null
          payload: Json | null
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          expires_at?: string | null
          payload?: Json | null
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          expires_at?: string | null
          payload?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_staff: { Args: never; Returns: boolean }
      listing_disponible: {
        Args: { p_desde: string; p_hasta: string; p_listing_id: string }
        Returns: boolean
      }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      estado_liquidacion: "borrador" | "emitido"
      estado_movimiento: "pendiente" | "confirmado" | "descartado"
      estado_propiedad: "activo" | "inactivo"
      modalidad_listing: "venta" | "dia" | "semana" | "mes" | "tradicional"
      origen_bloqueo: "ical" | "manual"
      tipo_movimiento: "ingreso" | "egreso"
      tipo_propiedad:
        | "apartamento"
        | "apartaestudio"
        | "penthouse"
        | "casa"
        | "cabana"
        | "finca"
        | "lote"
        | "local"
        | "bodega"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_liquidacion: ["borrador", "emitido"],
      estado_movimiento: ["pendiente", "confirmado", "descartado"],
      estado_propiedad: ["activo", "inactivo"],
      modalidad_listing: ["venta", "dia", "semana", "mes", "tradicional"],
      origen_bloqueo: ["ical", "manual"],
      tipo_movimiento: ["ingreso", "egreso"],
      tipo_propiedad: [
        "apartamento",
        "apartaestudio",
        "penthouse",
        "casa",
        "cabana",
        "finca",
        "lote",
        "local",
        "bodega",
      ],
    },
  },
} as const
