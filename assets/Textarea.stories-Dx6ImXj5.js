import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{i as n,n as r,r as i,t as a}from"./dist-Be47NwFh.js";import{n as o,t as s}from"./FormField-BlujlZsC.js";var c;function l(){return(l=e((()=>{r(),c=a([`block w-full min-w-0 rounded-md border border-input bg-background px-3 py-2`,`font-sans text-body text-foreground transition-colors placeholder:text-muted-foreground`,`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`,`disabled:cursor-not-allowed disabled:opacity-50`,`aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive`,`field-sizing-content resize-y overflow-y-auto max-h-96`,`min-h-[calc(var(--textarea-rows)*1lh+--spacing(4)+2px)]`])})))()}function u({className:e,rows:t=6,style:n,...r}){return(0,d.jsx)(`textarea`,{"data-slot":`textarea`,rows:t,style:{"--textarea-rows":t,...n},className:i(c(),e),...r})}var d;function f(){return(f=e((()=>{n(),l(),d=t(),u.__docgenInfo={description:``,methods:[],displayName:`Textarea`,props:{rows:{defaultValue:{value:`6`,computed:!1},required:!1}}}})))()}var p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{o(),f(),p=t(),{fn:m}=__STORYBOOK_MODULE_TEST__,h=`Você pode devolver o produto em até 7 dias corridos depois de receber o pedido, sem precisar explicar o motivo. O produto precisa voltar sem sinais de uso, com a etiqueta e na embalagem original. Para pedir a devolução, fale com a gente pelo e-mail da loja informando o número do pedido. Assim que o produto chegar e for conferido, devolvemos o valor pago, inclusive o frete, pelo mesmo meio de pagamento.`,g=Array.from({length:6},()=>h).join(`

`),_={title:`Atoms/Textarea`,component:u,tags:[`autodocs`],args:{"aria-label":`Política de trocas e devoluções`,placeholder:`Explique como o cliente pode trocar ou devolver um produto.`,rows:6,maxLength:2e4,disabled:!1,onChange:m()},argTypes:{rows:{control:`number`,description:`Altura mínima, em linhas; o campo cresce com o texto`},maxLength:{control:`number`,description:`Limite de caracteres do navegador`},placeholder:{control:`text`},disabled:{control:`boolean`,description:`Desativa o campo e tira do foco`},"aria-invalid":{control:`boolean`,description:"Estado de erro; dentro de um `FormField`, vem da prop `error`"}},decorators:[e=>(0,p.jsx)(`div`,{className:`max-w-md`,children:(0,p.jsx)(e,{})})]},v={},y={args:{defaultValue:g}},b={args:{"aria-invalid":!0,defaultValue:h}},x={args:{disabled:!0,defaultValue:h}},S={render:e=>(0,p.jsx)(s,{label:`Política de privacidade`,description:`Aparece no rodapé da loja. Até 20.000 caracteres.`,error:`Conte como a loja usa os dados dos clientes.`,children:(0,p.jsx)(u,{...e,"aria-label":void 0,placeholder:`Como a loja usa os dados.`})})},C={parameters:{controls:{disable:!0}},render:()=>(0,p.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,p.jsx)(u,{"aria-label":`Política de trocas`,placeholder:`Como o cliente devolve um produto.`}),(0,p.jsx)(u,{"aria-label":`Política de trocas com 3 linhas`,rows:3,defaultValue:h}),(0,p.jsx)(u,{"aria-label":`Política de trocas longa`,defaultValue:g}),(0,p.jsx)(u,{"aria-label":`Política com erro`,"aria-invalid":!0,defaultValue:h}),(0,p.jsx)(u,{"aria-label":`Política desativada`,disabled:!0,defaultValue:h}),(0,p.jsx)(s,{label:`Política de privacidade`,description:`Aparece no rodapé da loja. Até 20.000 caracteres.`,children:(0,p.jsx)(u,{maxLength:2e4})}),(0,p.jsx)(s,{label:`Política de privacidade com erro`,error:`Conte como a loja usa os dados dos clientes.`,children:(0,p.jsx)(u,{})})]})},w=[`Default`,`LongText`,`Invalid`,`Disabled`,`InFormField`,`AllVariants`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: LONG_POLICY
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-invalid': true,
    defaultValue: POLICY
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: POLICY
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <FormField label="Política de privacidade" description="Aparece no rodapé da loja. Até 20.000 caracteres." error="Conte como a loja usa os dados dos clientes.">
      <Textarea {...args} aria-label={undefined} placeholder="Como a loja usa os dados." />
    </FormField>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-4">
      <Textarea aria-label="Política de trocas" placeholder="Como o cliente devolve um produto." />
      <Textarea aria-label="Política de trocas com 3 linhas" rows={3} defaultValue={POLICY} />
      <Textarea aria-label="Política de trocas longa" defaultValue={LONG_POLICY} />
      <Textarea aria-label="Política com erro" aria-invalid defaultValue={POLICY} />
      <Textarea aria-label="Política desativada" disabled defaultValue={POLICY} />
      <FormField label="Política de privacidade" description="Aparece no rodapé da loja. Até 20.000 caracteres.">
        <Textarea maxLength={20000} />
      </FormField>
      <FormField label="Política de privacidade com erro" error="Conte como a loja usa os dados dos clientes.">
        <Textarea />
      </FormField>
    </div>
}`,...C.parameters?.docs?.source}}}})))()}T();export{C as AllVariants,v as Default,x as Disabled,S as InFormField,b as Invalid,y as LongText,w as __namedExportsOrder,_ as default};