import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./sparkles-D17mksxl.js";import{i,n as a,r as o,t as s}from"./dist-Be47NwFh.js";var c;function l(){return(l=e((()=>{a(),c=s([`inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap`,`rounded-button border border-transparent px-2.5 py-0.5 font-sans text-caption font-semibold`,`[&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0`],{variants:{variant:{primary:`bg-primary text-primary-foreground`,secondary:`bg-secondary text-secondary-foreground`,accent:`bg-accent text-accent-foreground`,outline:`border-border bg-background text-foreground`,success:`bg-success text-success-foreground`,warning:`bg-warning text-warning-foreground`,info:`bg-info text-info-foreground`,destructive:`bg-destructive text-destructive-foreground`}},defaultVariants:{variant:`primary`}})})))()}function u({className:e,variant:t,...n}){return(0,d.jsx)(`span`,{"data-slot":`badge`,className:o(c({variant:t}),e),...n})}var d;function f(){return(f=e((()=>{i(),l(),d=t(),u.__docgenInfo={description:`A short static label, such as “Mais popular”; the text carries the meaning, never the color alone.`,methods:[],displayName:`Badge`}})))()}var p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),f(),p=t(),m=[`primary`,`secondary`,`accent`,`outline`,`success`,`warning`,`info`,`destructive`],h={primary:`Mais popular`,secondary:`Novo`,accent:`Oferta`,outline:`Rascunho`,success:`Pago`,warning:`Aguardando pagamento`,info:`Em separação`,destructive:`Cancelado`},g={title:`Atoms/Badge`,component:u,tags:[`autodocs`],args:{children:`Mais popular`,variant:`primary`},argTypes:{variant:{control:`select`,options:m,description:`Cor do selo`},children:{control:`text`,description:`Texto curto, em até três palavras`}},parameters:{docs:{description:{component:`Selo estático para destacar um item: o plano mais escolhido, um rascunho, o status de um pedido. Não é clicável. O texto diz o que o selo significa, sem depender da cor. Escreva com inicial maiúscula (“Rascunho”), não em caixa alta: alguns leitores de tela soletram palavras curtas em maiúsculas.`}}}},_={},v={args:{variant:`outline`,children:`Rascunho`}},y={args:{variant:`accent`,children:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(r,{"aria-hidden":`true`}),`Mais popular`]})}},b={parameters:{controls:{disable:!0}},render:()=>(0,p.jsx)(`div`,{className:`flex flex-wrap items-center gap-3`,children:m.map(e=>(0,p.jsx)(u,{variant:e,children:h[e]},e))})},x=[`Default`,`Draft`,`WithIcon`,`AllVariants`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    children: 'Rascunho'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'accent',
    children: <>
        <Sparkles aria-hidden="true" />
        Mais popular
      </>
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}}})))()}S();export{b as AllVariants,_ as Default,v as Draft,y as WithIcon,x as __namedExportsOrder,g as default};