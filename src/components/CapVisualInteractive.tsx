import React from 'react';
import { CapAngle } from '../types';

interface CapVisualInteractiveProps {
  type?: string;
  paletteKey?: string;
  viewAngle?: CapAngle;
  size?: 'small' | 'normal' | 'large' | 'hero';
  customText?: string;
  crownHex?: string;
  visorHex?: string;
  accentHex?: string;
  showBadge?: boolean;
  imageUrl?: string;
  sideImageUrl?: string;
  backImageUrl?: string;
  undervisorImageUrl?: string;
}

export const CapVisualInteractive: React.FC<CapVisualInteractiveProps> = ({
  type = 'quetzal',
  paletteKey = 'green-gold',
  viewAngle = 'front',
  size = 'normal',
  customText = '',
  crownHex,
  visorHex,
  accentHex,
  showBadge = true,
  imageUrl,
  sideImageUrl,
  backImageUrl,
  undervisorImageUrl
}) => {
  const getColors = () => {
    // If explicit hex provided (e.g. from studio customizer)
    if (crownHex || visorHex) {
      return {
        crown: crownHex || '#166534',
        visor: visorHex || '#D97706',
        accent: accentHex || '#DC2626',
        detail: '#FEF08A',
        dark: '#14532D',
        mesh: '#15803D'
      };
    }

    switch (paletteKey) {
      case 'green-gold':
        return { crown: '#166534', visor: '#D97706', accent: '#DC2626', detail: '#FEF08A', dark: '#14532D', mesh: '#15803D' };
      case 'yellow-red':
        return { crown: '#B45309', visor: '#15803D', accent: '#EF4444', detail: '#FDE047', dark: '#78350F', mesh: '#D97706' };
      case 'tricolor':
        return { crown: '#F5F5F4', visor: '#166534', accent: '#DC2626', detail: '#EAB308', dark: '#E7E5E4', mesh: '#166534' };
      case 'heritage':
        return { crown: '#14532D', visor: '#991B1B', accent: '#F59E0B', detail: '#FDE68A', dark: '#052E16', mesh: '#166534' };
      case 'roots':
        return { crown: '#991B1B', visor: '#166534', accent: '#F59E0B', detail: '#FEF9C3', dark: '#7F1D1D', mesh: '#991B1B' };
      case 'volcano':
        return { crown: '#B91C1C', visor: '#78350F', accent: '#15803D', detail: '#FBBF24', dark: '#991B1B', mesh: '#78350F' };
      case 'classic-dark':
        return { crown: '#18181B', visor: '#D97706', accent: '#DC2626', detail: '#FDE047', dark: '#09090B', mesh: '#27272A' };
      default:
        return { crown: '#166534', visor: '#D97706', accent: '#DC2626', detail: '#FEF08A', dark: '#14532D', mesh: '#15803D' };
    }
  };

  const c = getColors();

  const heightClasses = {
    small: 'h-36',
    normal: 'h-48 sm:h-52',
    large: 'h-64 sm:h-80',
    hero: 'h-72 sm:h-96'
  };

  const patchLabel = customText ? customText.toUpperCase().slice(0, 10) : (
    type === 'quetzal' ? 'QUETZAL' :
    type === 'sunset' ? 'ATITLÁN' :
    type === 'trucker' ? 'RUTA 502' :
    type === 'camper' ? 'ANTIGUA' :
    type === 'roots' ? 'TIKAL 90s' :
    type === 'pacaya' ? 'PACAYA' : 'HATGT'
  );

  const activePhoto = 
    viewAngle === 'side' ? (sideImageUrl || imageUrl) :
    viewAngle === 'back' ? (backImageUrl || imageUrl) :
    viewAngle === 'undervisor' ? (undervisorImageUrl || imageUrl) :
    imageUrl;

  return (
    <div className={`relative w-full ${heightClasses[size]} bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F3EAD8] flex items-center justify-center p-3 sm:p-5 overflow-hidden rounded-xl border border-stone-300 select-none shadow-inner group/canvas`}>
      
      {/* Background retro pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_0.8px,transparent_0.8px)] [background-size:12px_12px] opacity-25 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Angle label badge */}
      {showBadge && (
        <div className="absolute top-2.5 right-2.5 bg-stone-900/90 text-amber-300 text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-amber-400/50 shadow-sm z-10 tracking-wider">
          {viewAngle === 'front' && 'Vista Frontal'}
          {viewAngle === 'side' && 'Vista Lateral 45°'}
          {viewAngle === 'back' && 'Broche / Ajuste'}
          {viewAngle === 'undervisor' && 'Bajo-Visera'}
        </div>
      )}

      {/* Tri-color Chapín Flag Stripe */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 opacity-80 pointer-events-none z-10">
        <div className="w-7 sm:w-9 h-1 bg-red-600 rounded-full" />
        <div className="w-5 sm:w-7 h-1 bg-amber-400 rounded-full" />
        <div className="w-8 sm:w-11 h-1 bg-emerald-600 rounded-full" />
      </div>

      {/* --- FOTO REAL PERSONALIZADA (SI EXISTE) --- */}
      {activePhoto ? (
        <div className="relative w-full h-full flex items-center justify-center p-2 z-0">
          <img 
            src={activePhoto} 
            alt={patchLabel}
            className="max-h-full max-w-full object-contain rounded-lg drop-shadow-[0_12px_14px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover/canvas:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <>
          {/* --- VISTA FRONTAL --- */}
          {viewAngle === 'front' && (
            <svg viewBox="0 0 320 200" className="w-full h-full max-h-56 drop-shadow-[0_14px_14px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover/canvas:scale-105">
              <ellipse cx="160" cy="170" rx="110" ry="18" fill="rgba(0,0,0,0.22)" filter="blur(4px)" />
              {/* Corona 6 paneles */}
              <path d="M 60 140 C 60 65, 120 40, 200 45 C 245 48, 260 90, 260 140 Z" fill={c.crown} stroke="#1F2937" strokeWidth="3.5" />
              
              {/* Panel central y costuras */}
              <path d="M 140 43 Q 155 90 160 140" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeDasharray="3,3" />
              <path d="M 200 45 Q 210 90 220 140" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
              
              {/* Ojales de ventilación metálicos */}
              <circle cx="110" cy="85" r="3.5" fill="#1F2937" stroke={c.detail} strokeWidth="1.5" />
              <circle cx="165" cy="75" r="3.5" fill="#1F2937" stroke={c.detail} strokeWidth="1.5" />
              <circle cx="225" cy="85" r="3.5" fill="#1F2937" stroke={c.detail} strokeWidth="1.5" />
              
              {/* Botón superior forrado */}
              <ellipse cx="165" cy="42" rx="9" ry="5" fill={c.accent} stroke="#1F2937" strokeWidth="2.5" />

              {/* Parche Retro Frontal Bordado en 3D */}
              <g transform="translate(102, 76)">
                <rect x="0" y="0" width="76" height="44" rx="7" fill="#FFFDF5" stroke={c.accent} strokeWidth="2.5" />
                <rect x="3" y="3" width="70" height="38" rx="5" fill="none" stroke={c.detail} strokeWidth="1.5" strokeDasharray="2,2" />
                <text x="38" y="18" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#991B1B" fontFamily="monospace" letterSpacing="0.5">
                  {patchLabel}
                </text>
                <text x="38" y="28" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#166534" letterSpacing="1">
                  GUATEMALA 502
                </text>
                <circle cx="16" cy="34" r="2" fill="#DC2626" />
                <circle cx="38" cy="34" r="2" fill="#F59E0B" />
                <circle cx="60" cy="34" r="2" fill="#10B981" />
              </g>

              {/* Visera Clásica */}
              <path d="M 50 135 C 70 148, 140 160, 275 142 C 295 144, 285 165, 235 170 C 130 180, 50 160, 40 145 C 36 138, 42 133, 50 135 Z" fill={c.visor} stroke="#1F2937" strokeWidth="3.5" />
              {/* Costuras de la visera */}
              <path d="M 58 144 C 110 162, 200 162, 265 148" fill="none" stroke={c.detail} strokeWidth="2" strokeDasharray="4,4" />
              <path d="M 66 150 C 115 168, 190 168, 250 155" fill="none" stroke={c.detail} strokeWidth="2" strokeDasharray="4,4" />
              
              {/* Sticker holográfico redondo original */}
              <circle cx="245" cy="152" r="11" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" />
              <text x="245" y="155" textAnchor="middle" fontSize="5" fontWeight="900" fill="#78350F">ORIGINAL</text>
            </svg>
          )}

          {/* --- VISTA LATERAL 45° --- */}
          {viewAngle === 'side' && (
            <svg viewBox="0 0 320 200" className="w-full h-full max-h-56 drop-shadow-[0_14px_14px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover/canvas:scale-105">
              <ellipse cx="160" cy="172" rx="115" ry="16" fill="rgba(0,0,0,0.2)" filter="blur(4px)" />
              {/* Corona Lateral */}
              <path d="M 90 140 C 85 80, 140 45, 210 50 C 260 55, 270 95, 270 138 Z" fill={c.crown} stroke="#1F2937" strokeWidth="3.5" />
              <path d="M 180 48 Q 185 95 190 140" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
              <circle cx="140" cy="85" r="3.5" fill="#1F2937" stroke={c.detail} strokeWidth="1.5" />
              <circle cx="225" cy="88" r="3.5" fill="#1F2937" stroke={c.detail} strokeWidth="1.5" />
              {/* Botón */}
              <ellipse cx="180" cy="47" rx="8" ry="5" fill={c.accent} stroke="#1F2937" strokeWidth="2.5" />
              {/* Bordado Lateral Hatgt 502 */}
              <g transform="translate(192, 98)">
                <rect x="0" y="0" width="42" height="22" rx="4" fill="#1F2937" stroke="#F59E0B" strokeWidth="1" />
                <text x="21" y="15" textAnchor="middle" fontSize="9" fontWeight="900" fill="#F59E0B">#502</text>
              </g>
              {/* Visera Perfil Curvado Proyectado */}
              <path d="M 92 135 C 50 138, 20 142, 10 152 C 25 158, 80 156, 110 142 Z" fill={c.visor} stroke="#1F2937" strokeWidth="3.5" />
              <path d="M 25 149 Q 60 148 95 140" stroke={c.detail} strokeWidth="2" strokeDasharray="3,3" fill="none" />
              {/* Broche lateral trasero asomándose */}
              <path d="M 268 128 L 285 130 L 283 138 L 268 137 Z" fill="#374151" stroke="#1F2937" strokeWidth="1.5" />
            </svg>
          )}

          {/* --- VISTA TRASERA (BROCHE AJUSTABLE) --- */}
          {viewAngle === 'back' && (
            <svg viewBox="0 0 320 200" className="w-full h-full max-h-56 drop-shadow-[0_14px_14px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover/canvas:scale-105">
              <ellipse cx="160" cy="170" rx="90" ry="16" fill="rgba(0,0,0,0.2)" filter="blur(4px)" />
              {/* Corona vista posterior */}
              <path d="M 80 140 C 80 65, 125 45, 160 45 C 195 45, 240 65, 240 140 Z" fill={c.crown} stroke="#1F2937" strokeWidth="3.5" />
              <path d="M 160 45 L 160 90" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="3,3" />
              <ellipse cx="160" cy="45" rx="8" ry="4" fill={c.accent} stroke="#1F2937" strokeWidth="2" />
              
              {/* Arco abierto clásico posterior */}
              <path d="M 115 140 C 115 100, 205 100, 205 140 Z" fill="#FAF7F0" stroke="#1F2937" strokeWidth="3" />
              
              {/* Bordado sobre el arco: "GUATEMALA" */}
              <path d="M 120 95 Q 160 85 200 95" id="archPath" fill="none" stroke="none" />
              <text fontSize="7.5" fontWeight="900" fill={c.detail} letterSpacing="1.5">
                <textPath href="#archPath" startOffset="50%" textAnchor="middle">GUATEMALA 1984</textPath>
              </text>

              {/* Broche Snapback con orificios */}
              <g transform="translate(112, 126)">
                {/* Cinta macho */}
                <rect x="0" y="0" width="55" height="12" rx="2" fill="#1F2937" stroke="#111827" strokeWidth="1" />
                <circle cx="10" cy="6" r="1.8" fill="#F59E0B" />
                <circle cx="20" cy="6" r="1.8" fill="#F59E0B" />
                <circle cx="30" cy="6" r="1.8" fill="#F59E0B" />
                <circle cx="40" cy="6" r="1.8" fill="#F59E0B" />
                {/* Cinta hembra superpuesta */}
                <rect x="42" y="0" width="52" height="12" rx="2" fill="#374151" stroke="#111827" strokeWidth="1" />
                <circle cx="52" cy="6" r="1.8" fill="#111827" />
                <circle cx="62" cy="6" r="1.8" fill="#111827" />
                <circle cx="72" cy="6" r="1.8" fill="#111827" />
                <circle cx="82" cy="6" r="1.8" fill="#111827" />
              </g>
              {/* Borde inferior interno */}
              <path d="M 80 140 C 110 146, 210 146, 240 140" stroke="#1F2937" strokeWidth="3.5" fill="none" />
            </svg>
          )}

          {/* --- MACRO DETALLE BORDADO 3D --- */}
          {viewAngle === 'detail' && (
            <svg viewBox="0 0 320 200" className="w-full h-full max-h-56 drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/canvas:scale-105">
              {/* Fondo textura tela */}
              <rect x="20" y="20" width="280" height="160" rx="12" fill={c.crown} stroke="#1F2937" strokeWidth="3" />
              {/* Líneas de textura */}
              {[...Array(14)].map((_, i) => (
                <line key={i} x1="20" y1={30 + i * 11} x2="300" y2={30 + i * 11} stroke={c.dark} strokeWidth="2" opacity="0.6" />
              ))}
              {/* Super Parche 3D Macro */}
              <rect x="60" y="42" width="200" height="116" rx="10" fill="#FFFDF5" stroke={c.accent} strokeWidth="4" />
              <rect x="67" y="49" width="186" height="102" rx="6" fill="none" stroke={c.detail} strokeWidth="2.5" strokeDasharray="4,4" />
              
              <text x="160" y="82" textAnchor="middle" fontSize="20" fontWeight="900" fill="#991B1B" fontFamily="monospace" letterSpacing="2">
                {patchLabel}
              </text>
              <text x="160" y="103" textAnchor="middle" fontSize="11" fontWeight="900" fill="#166534" letterSpacing="3">
                GUATEMALA 1984
              </text>
              <text x="160" y="122" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#6B7280">
                ALGODÓN PEINADO • BORDADO DE ALTA DEFINICIÓN
              </text>

              {/* Hilos decorativos */}
              <circle cx="100" cy="136" r="5" fill="#DC2626" />
              <circle cx="160" cy="136" r="5" fill="#F59E0B" />
              <circle cx="220" cy="136" r="5" fill="#10B981" />
            </svg>
          )}

          {/* --- VISTA BAJO-VISERA RETRO (UNDERVISOR) --- */}
          {viewAngle === 'undervisor' && (
            <svg viewBox="0 0 320 200" className="w-full h-full max-h-56 drop-shadow-[0_14px_14px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover/canvas:scale-105">
              <ellipse cx="160" cy="170" rx="110" ry="16" fill="rgba(0,0,0,0.2)" filter="blur(4px)" />
              {/* Bajo-visera clásico verde botella ocre anti-reflejo */}
              <path d="M 40 100 C 60 40, 260 40, 280 100 C 260 165, 60 165, 40 100 Z" fill="#15803D" stroke="#1F2937" strokeWidth="3.5" />
              <path d="M 60 100 C 80 55, 240 55, 260 100 C 240 145, 80 145, 60 100 Z" fill="#166534" stroke="#1F2937" strokeWidth="2" strokeDasharray="3,3" />
              
              {/* Etiqueta interna de autenticidad Hatgt */}
              <rect x="110" y="80" width="100" height="40" rx="4" fill="#FFFDF5" stroke="#1F2937" strokeWidth="1.5" />
              <text x="160" y="96" textAnchor="middle" fontSize="9" fontWeight="900" fill="#991B1B">HATGT ORIGINAL</text>
              <text x="160" y="108" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#374151">TALLA AJUSTABLE 54-62cm</text>
              <text x="160" y="116" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#166534">HECHO CON ALGODÓN PEINADO</text>
            </svg>
          )}

          {/* --- CAJA DE ENVÍO PROTEGIDA HATGT --- */}
          {viewAngle === 'box' && (
            <svg viewBox="0 0 320 200" className="w-full h-full max-h-56 drop-shadow-[0_16px_16px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover/canvas:scale-105">
              <ellipse cx="160" cy="175" rx="110" ry="14" fill="rgba(0,0,0,0.2)" filter="blur(4px)" />
              {/* Caja Isométrica Vintage */}
              <polygon points="160,35 270,80 160,125 50,80" fill="#D97706" stroke="#1F2937" strokeWidth="3" />
              <polygon points="50,80 160,125 160,170 50,125" fill="#B45309" stroke="#1F2937" strokeWidth="3" />
              <polygon points="160,125 270,80 270,125 160,170" fill="#92400E" stroke="#1F2937" strokeWidth="3" />
              
              {/* Cinta de Seguridad Tri-Color Chapina */}
              <polygon points="145,41 175,53 175,145 145,133" fill="#DC2626" opacity="0.9" />
              <polygon points="152,44 168,50 168,142 152,136" fill="#FDE047" opacity="0.95" />
              
              {/* Sello de Autenticidad */}
              <circle cx="160" cy="95" r="22" fill="#166534" stroke="#FAF7F0" strokeWidth="2.5" />
              <text x="160" y="93" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#FEF08A">HATGT</text>
              <text x="160" y="102" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#FFFFFF">PROTEGIDO</text>

              {/* Sello de Envío GT */}
              <rect x="65" y="100" width="35" height="18" fill="#FFFBEB" stroke="#1F2937" strokeWidth="1" transform="rotate(-15 65 100)" />
              <text x="75" y="112" fontSize="5" fontWeight="bold" fill="#B91C1C" transform="rotate(-15 65 100)">GUATEX/CARGO</text>
            </svg>
          )}
        </>
      )}

    </div>
  );
};
