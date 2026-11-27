import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,r,t as i}from"./RadioGroup-dtc_85Jj.js";var a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{r(),a=t(),{fn:o}=__STORYBOOK_MODULE_TEST__,s=[{value:`basic`,label:`Básico`,description:`Grátis · até 30 produtos físicos`},{value:`professional`,label:`Profissional`,description:`R$ 79,99/mês · até 100 produtos, físicos e digitais`},{value:`enterprise`,label:`Enterprise`,description:`R$ 149,99/mês · cursos em vídeo com marca d’água`,badge:`Em breve`,disabled:!0}],c={title:`Atoms/RadioGroup`,component:i,tags:[`autodocs`],args:{"aria-label":`Plano`,variant:`default`,defaultValue:`basic`,disabled:!1,onValueChange:o()},argTypes:{variant:{control:`select`,options:[`default`,`card`],description:"`card` mostra cada opção num cartão clicável, para escolhas com detalhes"},disabled:{control:`boolean`,description:`Desativa todas as opções`},defaultValue:{control:`text`},asChild:{table:{disable:!0}}},render:e=>(0,a.jsx)(i,{...e,children:s.map(e=>(0,a.jsx)(n,{...e},e.value))})},l={},u={args:{variant:`card`,className:`max-w-md`}},d={args:{disabled:!0}},f={parameters:{controls:{disable:!0}},render:()=>(0,a.jsxs)(`div`,{className:`grid gap-8 md:grid-cols-2`,children:[(0,a.jsxs)(i,{"aria-label":`Frete`,defaultValue:`pac`,children:[(0,a.jsx)(n,{value:`pac`,label:`PAC`,description:`Chega em até 8 dias úteis`}),(0,a.jsx)(n,{value:`sedex`,label:`SEDEX`,description:`Chega em até 3 dias úteis`}),(0,a.jsx)(n,{value:`pickup`,label:`Retirar na loja`}),(0,a.jsx)(n,{value:`moto`,label:`Motoboy`,badge:`Em breve`,disabled:!0})]}),(0,a.jsx)(i,{"aria-label":`Plano`,variant:`card`,defaultValue:`professional`,children:s.map(e=>(0,a.jsx)(n,{...e},e.value))})]})},p=[`Default`,`Card`,`Disabled`,`AllVariants`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'card',
    className: 'max-w-md'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="grid gap-8 md:grid-cols-2">
      <RadioGroup aria-label="Frete" defaultValue="pac">
        <RadioGroupItem value="pac" label="PAC" description="Chega em até 8 dias úteis" />
        <RadioGroupItem value="sedex" label="SEDEX" description="Chega em até 3 dias úteis" />
        <RadioGroupItem value="pickup" label="Retirar na loja" />
        <RadioGroupItem value="moto" label="Motoboy" badge="Em breve" disabled />
      </RadioGroup>
      <RadioGroup aria-label="Plano" variant="card" defaultValue="professional">
        {PLANS.map(plan => <RadioGroupItem key={plan.value} {...plan} />)}
      </RadioGroup>
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as AllVariants,u as Card,l as Default,d as Disabled,p as __namedExportsOrder,c as default};