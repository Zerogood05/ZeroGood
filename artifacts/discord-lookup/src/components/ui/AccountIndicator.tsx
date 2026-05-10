import React from 'react';

export const AccountIndicator = ({ createdAt }: { createdAt: string | number }) => {
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

  let config = { color: "bg-green-500", label: "Cuenta Segura", shadow: "shadow-[0_0_10px_#22c55e]" };

  if (diffDays <= 7) {
    config = { color: "bg-red-500", label: "¡ALERTA! Menos de 7 días", shadow: "shadow-[0_0_15px_#ef4444] animate-pulse" };
  } else if (diffDays <= 30) {
    config = { color: "bg-yellow-500", label: "Cuenta Reciente", shadow: "shadow-[0_0_10px_#eab308]" };
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 my-2">
      <div className={`w-3 h-3 rounded-full ${config.color} ${config.shadow}`} />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white uppercase tracking-wider">{config.label}</span>
        <span className="text-[10px] text-gray-400">{diffDays} días de antigüedad</span>
      </div>
    </div>
  );
};
