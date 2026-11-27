import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DvvP-0SR.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,r as i,t as a}from"./RadioGroup-dtc_85Jj.js";import{n as o,t as s}from"./Button-Baz-k9Ie.js";import{n as c,t as l}from"./Input-1zptAiVN.js";import{n as u,t as d}from"./FormField-BlujlZsC.js";function f(){let[e,t]=(0,p.useState)({}),n=(0,p.useRef)(null),r=(0,p.useRef)(null);function i(e){e.preventDefault();let i=n.current?.value.trim()??``,a=r.current?.value??``,o={name:i?void 0:`Informe o nome da loja.`,slug:/^[a-z0-9-]{3,}$/.test(a)?void 0:`Use ao menos 3 letras minúsculas, números ou hífen.`};t(o),o.name?n.current?.focus():o.slug&&r.current?.focus()}return(0,m.jsxs)(`form`,{"aria-label":`Criar loja`,noValidate:!0,onSubmit:i,className:`flex flex-col gap-4`,children:[(0,m.jsx)(d,{label:`Nome da loja`,error:e.name,children:(0,m.jsx)(l,{ref:n,name:`name`,autoComplete:`organization`})}),(0,m.jsx)(d,{label:`Endereço da loja`,description:h,error:e.slug,children:(0,m.jsx)(l,{ref:r,name:`slug`,suffix:`.purpler.com.br`,autoCapitalize:`none`})}),(0,m.jsx)(s,{type:`submit`,className:`self-start`,children:`Criar loja`})]})}var p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{p=t(),o(),c(),i(),u(),m=n(),h=`Só letras minúsculas, números e hífen. Dá para trocar depois.`,g={title:`Molecules/FormField`,component:d,tags:[`autodocs`],args:{label:`Endereço da loja`,description:h,error:``,children:(0,m.jsx)(l,{placeholder:`docesdaana`,suffix:`.purpler.com.br`})},argTypes:{label:{control:`text`,description:`Nome visível do campo`},description:{control:`text`,description:`Ajuda abaixo do campo, lida depois do nome`},error:{control:`text`,description:"Mensagem de erro; marca o campo com `aria-invalid` e é anunciada ao aparecer"},children:{control:!1,description:"Um único controle (`Input`, `RadioGroup`…)"}},decorators:[e=>(0,m.jsx)(`div`,{className:`max-w-md`,children:(0,m.jsx)(e,{})})]},_={},v={args:{error:`Esse endereço já está em uso. Tente outro.`}},y={args:{label:`Plano`,description:`Você pode mudar de plano quando quiser.`,children:(0,m.jsxs)(a,{variant:`card`,defaultValue:`basic`,children:[(0,m.jsx)(r,{value:`basic`,label:`Básico`,description:`Grátis · até 30 produtos`}),(0,m.jsx)(r,{value:`enterprise`,label:`Enterprise`,description:`R$ 149,99/mês · até 150 produtos`,badge:`Em breve`,disabled:!0})]})}},b={parameters:{controls:{disable:!0}},render:()=>(0,m.jsx)(f,{})},x={parameters:{controls:{disable:!0}},render:()=>(0,m.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,m.jsx)(d,{label:`Nome da loja`,children:(0,m.jsx)(l,{placeholder:`Doces da Ana`})}),(0,m.jsx)(d,{label:`Endereço da loja`,description:h,children:(0,m.jsx)(l,{placeholder:`docesdaana`,suffix:`.purpler.com.br`})}),(0,m.jsx)(d,{label:`Endereço com erro`,description:h,error:`Esse endereço já está em uso. Tente outro.`,children:(0,m.jsx)(l,{defaultValue:`docesdaana`,suffix:`.purpler.com.br`})}),(0,m.jsx)(d,{label:`Preço`,error:`Informe um valor maior que zero.`,children:(0,m.jsx)(l,{defaultValue:`0,00`,prefix:`R$`,inputMode:`decimal`})}),(0,m.jsx)(d,{label:`E-mail da conta`,description:`Vem da sua conta Google.`,children:(0,m.jsx)(l,{type:`email`,defaultValue:`ana@docesdaana.com.br`,disabled:!0})}),(0,m.jsx)(d,{label:`Plano`,error:`Escolha um plano para continuar.`,children:(0,m.jsxs)(a,{variant:`card`,children:[(0,m.jsx)(r,{value:`basic`,label:`Básico`,description:`Grátis · até 30 produtos`}),(0,m.jsx)(r,{value:`professional`,label:`Profissional`,description:`R$ 79,99/mês · até 100 produtos`})]})})]})},S=[`Default`,`WithError`,`WithRadioGroup`,`ValidationFlow`,`AllVariants`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Esse endereço já está em uso. Tente outro.'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Plano',
    description: 'Você pode mudar de plano quando quiser.',
    children: <RadioGroup variant="card" defaultValue="basic">
        <RadioGroupItem value="basic" label="Básico" description="Grátis · até 30 produtos" />
        <RadioGroupItem value="enterprise" label="Enterprise" description="R$ 149,99/mês · até 150 produtos" badge="Em breve" disabled />
      </RadioGroup>
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <CreateStoreForm />
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-6">
      <FormField label="Nome da loja">
        <Input placeholder="Doces da Ana" />
      </FormField>
      <FormField label="Endereço da loja" description={SLUG_HELP}>
        <Input placeholder="docesdaana" suffix=".purpler.com.br" />
      </FormField>
      <FormField label="Endereço com erro" description={SLUG_HELP} error="Esse endereço já está em uso. Tente outro.">
        <Input defaultValue="docesdaana" suffix=".purpler.com.br" />
      </FormField>
      <FormField label="Preço" error="Informe um valor maior que zero.">
        <Input defaultValue="0,00" prefix="R$" inputMode="decimal" />
      </FormField>
      <FormField label="E-mail da conta" description="Vem da sua conta Google.">
        <Input type="email" defaultValue="ana@docesdaana.com.br" disabled />
      </FormField>
      <FormField label="Plano" error="Escolha um plano para continuar.">
        <RadioGroup variant="card">
          <RadioGroupItem value="basic" label="Básico" description="Grátis · até 30 produtos" />
          <RadioGroupItem value="professional" label="Profissional" description="R$ 79,99/mês · até 100 produtos" />
        </RadioGroup>
      </FormField>
    </div>
}`,...x.parameters?.docs?.source}}}})))()}C();export{x as AllVariants,_ as Default,b as ValidationFlow,v as WithError,y as WithRadioGroup,S as __namedExportsOrder,g as default};