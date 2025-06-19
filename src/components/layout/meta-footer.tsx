
"use client";

import React from 'react';

export default function MetaFooter() {
  const currentYear = new Date().getFullYear();

  const companyData = [
    { label: "CNPJ", value: "35.842.611/0001-61" },
    { label: "Endereço", value: "R. Marcelino Simas, 481 – Estreito, Florianópolis/SC" },
    { label: "Email", value: "kennedypromotora@gmail.com" },
    { label: "Telefone", value: "(48) 99678-5694" },
  ];

  return (
    <footer className="bg-zinc-900 text-zinc-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          {companyData.map((item) => (
            <div key={item.label} className="text-sm">
              <span className="font-semibold text-zinc-200">{item.label}: </span>
              <span className="text-zinc-400">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-700 pt-6 text-center">
          <p className="text-xs text-zinc-500">
            © {currentYear} Kennedy Informações Cadastrais LTDA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
