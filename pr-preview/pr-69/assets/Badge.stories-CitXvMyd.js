import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./sparkles-D17mksxl.js";import{n as i,t as a}from"./Badge-vXD7Rwpz.js";var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),i(),o=t(),s=[`primary`,`secondary`,`accent`,`outline`,`success`,`warning`,`info`,`destructive`],c={primary:`Mais popular`,secondary:`Novo`,accent:`Oferta`,outline:`Rascunho`,success:`Pago`,warning:`Aguardando pagamento`,info:`Em separação`,destructive:`Cancelado`},l={title:`Atoms/Badge`,component:a,tags:[`autodocs`],args:{children:`Mais popular`,variant:`primary`},argTypes:{variant:{control:`select`,options:s,description:`Cor do selo`},children:{control:`text`,description:`Texto curto, em até três palavras`}},parameters:{docs:{description:{component:`Selo estático para destacar um item: o plano mais escolhido, um rascunho, o status de um pedido. Não é clicável. O texto diz o que o selo significa, sem depender da cor. Escreva com inicial maiúscula (“Rascunho”), não em caixa alta: alguns leitores de tela soletram palavras curtas em maiúsculas.`}}}},u={},d={args:{variant:`outline`,children:`Rascunho`}},f={args:{variant:`accent`,children:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r,{"aria-hidden":`true`}),`Mais popular`]})}},p={parameters:{controls:{disable:!0}},render:()=>(0,o.jsx)(`div`,{className:`flex flex-wrap items-center gap-3`,children:s.map(e=>(0,o.jsx)(a,{variant:e,children:c[e]},e))})},m=[`Default`,`Draft`,`WithIcon`,`AllVariants`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    children: 'Rascunho'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'accent',
    children: <>
        <Sparkles aria-hidden="true" />
        Mais popular
      </>
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(variant => <Badge key={variant} variant={variant}>
          {EXAMPLES[variant]}
        </Badge>)}
    </div>
}`,...p.parameters?.docs?.source}}}})))()}h();export{p as AllVariants,u as Default,d as Draft,f as WithIcon,m as __namedExportsOrder,l as default};