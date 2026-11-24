import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./createLucideIcon-6TdcU4yl.js";import{a as i,i as a,n as o,o as s,r as c,t as l}from"./triangle-exclamation-point-BhNqWPsk.js";import{i as u,n as d,r as f,t as p}from"./dist-Be47NwFh.js";var m,h;function g(){return(g=e((()=>{n(),m={name:`circle-exclamation-point`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`,key:`1pkeuh`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`,key:`4dfq90`}]],aliases:[`alert-circle`,`circle-alert`]},m.node,h=r(m)})))()}var _;function v(){return(v=e((()=>{d(),_=p([`grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 rounded-lg px-4 py-3 text-small`,`[&>svg]:size-5 [&>svg]:shrink-0`],{variants:{variant:{info:`bg-info text-info-foreground`,success:`bg-success text-success-foreground`,warning:`bg-warning text-warning-foreground`,destructive:`bg-destructive text-destructive-foreground`}},defaultVariants:{variant:`info`}})})))()}function y({className:e,variant:t,children:n,...r}){let i=C[t??`info`];return(0,S.jsxs)(`div`,{"data-slot":`alert`,role:t===`destructive`?`alert`:`status`,className:f(_({variant:t}),e),...r,children:[(0,S.jsx)(i,{"aria-hidden":`true`}),n]})}function b({className:e,...t}){return(0,S.jsx)(`p`,{"data-slot":`alert-title`,className:f(`col-start-2 font-semibold`,e),...t})}function x({className:e,...t}){return(0,S.jsx)(`div`,{"data-slot":`alert-description`,className:f(`col-start-2`,e),...t})}var S,C;function w(){return(w=e((()=>{g(),s(),a(),o(),u(),v(),S=t(),C={info:c,success:i,warning:l,destructive:h},y.__docgenInfo={description:``,methods:[],displayName:`Alert`},b.__docgenInfo={description:``,methods:[],displayName:`AlertTitle`},x.__docgenInfo={description:``,methods:[],displayName:`AlertDescription`}})))()}var T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{w(),T=t(),E=[`info`,`success`,`warning`,`destructive`],D={info:{title:`Sua loja está em rascunho`,description:`Cadastre um produto e um meio de pagamento para publicar.`},success:{title:`Produto salvo`,description:`As mudanças já aparecem na sua loja.`},warning:{title:`Você usou 80% das interações com IA`,description:`A cota renova no primeiro dia do mês.`},destructive:{title:`Não foi possível entrar`,description:`A conexão com o Google falhou. Tente de novo em alguns minutos.`}},O=e=>(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(b,{children:D[e].title}),(0,T.jsx)(x,{children:D[e].description})]}),k={title:`Molecules/Alert`,component:y,tags:[`autodocs`],args:{variant:`info`,children:O(`info`)},argTypes:{variant:{control:`select`,options:E,description:'Tipo do aviso: só `destructive` interrompe o leitor de tela (`role="alert"`)'},children:{control:!1,description:"`AlertTitle` e `AlertDescription`"}}},A={},j={args:{variant:`success`,children:O(`success`)}},M={args:{variant:`warning`,children:O(`warning`)}},N={args:{variant:`destructive`,children:O(`destructive`)}},P={args:{children:(0,T.jsx)(x,{children:D.info.description})}},F={parameters:{controls:{disable:!0}},render:()=>(0,T.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[E.map(e=>(0,T.jsx)(y,{variant:e,children:O(e)},e)),E.map(e=>(0,T.jsx)(y,{variant:e,children:(0,T.jsx)(b,{children:D[e].title})},`${e}-title`))]})},I=[`Default`,`Success`,`Warning`,`Destructive`,`DescriptionOnly`,`AllVariants`],A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: content('success')
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: content('warning')
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'destructive',
    children: content('destructive')
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    children: <AlertDescription>{COPY.info.description}</AlertDescription>
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-4">
      {VARIANTS.map(variant => <Alert key={variant} variant={variant}>
          {content(variant)}
        </Alert>)}
      {VARIANTS.map(variant => <Alert key={\`\${variant}-title\`} variant={variant}>
          <AlertTitle>{COPY[variant].title}</AlertTitle>
        </Alert>)}
    </div>
}`,...F.parameters?.docs?.source}}}})))()}L();export{F as AllVariants,A as Default,P as DescriptionOnly,N as Destructive,j as Success,M as Warning,I as __namedExportsOrder,k as default};