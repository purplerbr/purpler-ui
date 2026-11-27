import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./search-CCp79FFr.js";import{n as i,t as a}from"./Input-1zptAiVN.js";var o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),i(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`Atoms/Input`,component:a,tags:[`autodocs`],args:{"aria-label":`Nome da loja`,placeholder:`Doces da Ana`,disabled:!1,onChange:s()},argTypes:{prefix:{control:`text`,description:`Texto fixo antes do valor (fica fora do valor)`},suffix:{control:`text`,description:`Texto fixo depois do valor (fica fora do valor)`},placeholder:{control:`text`},disabled:{control:`boolean`,description:`Desativa o campo e tira do foco`},"aria-invalid":{control:`boolean`,description:"Estado de erro; dentro de um `FormField`, vem da prop `error`"}},decorators:[e=>(0,o.jsx)(`div`,{className:`max-w-sm`,children:(0,o.jsx)(e,{})})]},l={},u={args:{"aria-label":`Endereço da loja`,placeholder:`docesdaana`,suffix:`.purpler.com.br`}},d={args:{"aria-label":`Preço`,placeholder:`0,00`,prefix:`R$`,inputMode:`decimal`}},f={args:{"aria-invalid":!0,defaultValue:`Doces da Ana!`}},p={args:{disabled:!0,defaultValue:`Doces da Ana`}},m={parameters:{controls:{disable:!0}},render:()=>(0,o.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,o.jsx)(a,{"aria-label":`Nome da loja`,placeholder:`Doces da Ana`}),(0,o.jsx)(a,{"aria-label":`Endereço da loja`,placeholder:`docesdaana`,suffix:`.purpler.com.br`}),(0,o.jsx)(a,{"aria-label":`Preço`,placeholder:`0,00`,prefix:`R$`,inputMode:`decimal`}),(0,o.jsx)(a,{"aria-label":`Buscar produtos`,type:`search`,placeholder:`Buscar produtos`,prefix:(0,o.jsx)(r,{"aria-hidden":`true`})}),(0,o.jsx)(a,{"aria-label":`Nome com erro`,"aria-invalid":!0,defaultValue:`Doces da Ana!`}),(0,o.jsx)(a,{"aria-label":`Endereço com erro`,"aria-invalid":!0,defaultValue:`doces da ana`,suffix:`.purpler.com.br`}),(0,o.jsx)(a,{"aria-label":`Nome desativado`,disabled:!0,defaultValue:`Doces da Ana`}),(0,o.jsx)(a,{"aria-label":`Endereço desativado`,disabled:!0,defaultValue:`docesdaana`,suffix:`.purpler.com.br`})]})},h=[`Default`,`WithSuffix`,`WithPrefix`,`Invalid`,`Disabled`,`AllVariants`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Endereço da loja',
    placeholder: 'docesdaana',
    suffix: '.purpler.com.br'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Preço',
    placeholder: '0,00',
    prefix: 'R$',
    inputMode: 'decimal'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-invalid': true,
    defaultValue: 'Doces da Ana!'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: 'Doces da Ana'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-4">
      <Input aria-label="Nome da loja" placeholder="Doces da Ana" />
      <Input aria-label="Endereço da loja" placeholder="docesdaana" suffix=".purpler.com.br" />
      <Input aria-label="Preço" placeholder="0,00" prefix="R$" inputMode="decimal" />
      <Input aria-label="Buscar produtos" type="search" placeholder="Buscar produtos" prefix={<Search aria-hidden="true" />} />
      <Input aria-label="Nome com erro" aria-invalid defaultValue="Doces da Ana!" />
      <Input aria-label="Endereço com erro" aria-invalid defaultValue="doces da ana" suffix=".purpler.com.br" />
      <Input aria-label="Nome desativado" disabled defaultValue="Doces da Ana" />
      <Input aria-label="Endereço desativado" disabled defaultValue="docesdaana" suffix=".purpler.com.br" />
    </div>
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as AllVariants,l as Default,p as Disabled,f as Invalid,d as WithPrefix,u as WithSuffix,h as __namedExportsOrder,c as default};