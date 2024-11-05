// Define la estructura de un registro de entrada o salida
export interface Registro {
    id: number;
    hora: string;
    tipo: 'entrada' | 'salida';
  }
  
  // Define la estructura de datos para un tarjetón
  export interface TarjetonData {
    numero: number;
    placa?: string;
    color: 'rojo' | 'verde';
    registros: Registro[];
  }
  
  // Define la estructura de datos para un visitante
  export interface VisitanteData {
    placa: string;
    registros: Registro[];
  }
  
  // Props para el componente de la tabla de tarjetones
  export interface TarjetonesTableProps {
    datosTarjetones: TarjetonData[];
    toggleExpandido: (id: string) => void;
    expandido: { [key: string]: boolean };
  }
  
  // Props para el componente de la tabla de visitantes
  export interface VisitantesTableProps {
    datosVisitantes: VisitanteData[];
    toggleExpandido: (id: string) => void;
    expandido: { [key: string]: boolean };
  }
  
  // Props para el componente del formulario de registro
  export interface FormularioRegistroProps {
    tarjeton: number | '';
    setTarjeton: React.Dispatch<React.SetStateAction<number | ''>>;
    placa: string;
    setPlaca: React.Dispatch<React.SetStateAction<string>>;
    color: 'rojo' | 'verde';
    setColor: React.Dispatch<React.SetStateAction<'rojo' | 'verde'>>;
    esVisitante: boolean;
    setEsVisitante: React.Dispatch<React.SetStateAction<boolean>>;
    manejarRegistro: (tipo: 'entrada' | 'salida') => void;
    isAuthenticated: boolean;
    fechaBitacora: string;
    setFechaBitacora: React.Dispatch<React.SetStateAction<string>>;
  }
  
  // Props para el componente de banner de sesión
  export interface BannerSesionProps {
    isAuthenticated: boolean;
  }