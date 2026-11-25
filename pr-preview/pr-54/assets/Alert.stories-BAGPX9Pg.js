import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{i as n,n as r,r as i,t as a}from"./Alert-KkL7uIG2.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),o=t(),s=[`info`,`success`,`warning`,`destructive`],c={info:{title:`Sua loja está em rascunho`,description:`Cadastre um produto e um meio de pagamento para publicar.`},success:{title:`Produto salvo`,description:`As mudanças já aparecem na sua loja.`},warning:{title:`Você usou 80% das interações com IA`,description:`A cota renova no primeiro dia do mês.`},destructive:{title:`Não foi possível entrar`,description:`A conexão com o Google falhou. Tente de novo em alguns minutos.`}},l=e=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i,{children:c[e].title}),(0,o.jsx)(r,{children:c[e].description})]}),u={title:`Molecules/Alert`,component:a,tags:[`autodocs`],args:{variant:`info`,children:l(`info`)},argTypes:{variant:{control:`select`,options:s,description:'Tipo do aviso: só `destructive` interrompe o leitor de tela (`role="alert"`)'},children:{control:!1,description:"`AlertTitle` e `AlertDescription`"}}},d={},f={args:{variant:`success`,children:l(`success`)}},p={args:{variant:`warning`,children:l(`warning`)}},m={args:{variant:`destructive`,children:l(`destructive`)}},h={args:{children:(0,o.jsx)(r,{children:c.info.description})}},g={parameters:{controls:{disable:!0}},render:()=>(0,o.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[s.map(e=>(0,o.jsx)(a,{variant:e,children:l(e)},e)),s.map(e=>(0,o.jsx)(a,{variant:e,children:(0,o.jsx)(i,{children:c[e].title})},`${e}-title`))]})},_=[`Default`,`Success`,`Warning`,`Destructive`,`DescriptionOnly`,`AllVariants`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: content('success')
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: content('warning')
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'destructive',
    children: content('destructive')
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: <AlertDescription>{COPY.info.description}</AlertDescription>
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}}})))()}v();export{g as AllVariants,d as Default,h as DescriptionOnly,m as Destructive,f as Success,p as Warning,_ as __namedExportsOrder,u as default};