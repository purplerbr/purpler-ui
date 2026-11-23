import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./createLucideIcon-6TdcU4yl.js";import{a as i,i as a,n as o,o as s,r as c,t as l}from"./Button-CDUnIuMW.js";var u,d;function f(){return(f=e((()=>{n(),u={name:`arrow-right`,size:24,node:[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]},u.node,d=r(u)})))()}var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{f(),s(),a(),o(),p=t(),{fn:m}=__STORYBOOK_MODULE_TEST__,h=[`primary`,`secondary`,`outline`,`ghost`,`destructive`,`link`],g=[`sm`,`md`,`lg`],_={primary:`Publicar loja`,secondary:`Ver detalhes`,outline:`Editar produto`,ghost:`Cancelar`,destructive:`Excluir produto`,link:`Ver todos os pedidos`},v={title:`Atoms/Button`,component:l,tags:[`autodocs`],args:{children:`Comprar agora`,variant:`primary`,size:`md`,disabled:!1,loading:!1,onClick:m()},argTypes:{variant:{control:`select`,options:h,description:`Estilo visual`},size:{control:`select`,options:[...g,`icon`],description:`Tamanho`},disabled:{control:`boolean`,description:`Desativa o botão e tira do foco`},loading:{control:`boolean`,description:`Mostra o indicador de carregamento e bloqueia o clique, sem perder o foco`},asChild:{table:{disable:!0}},children:{control:`text`,description:`Texto do botão: comece com um verbo`}}},y={},b={args:{variant:`secondary`,children:_.secondary}},x={args:{variant:`outline`,children:_.outline}},S={args:{variant:`ghost`,children:_.ghost}},C={args:{variant:`destructive`,children:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(c,{"aria-hidden":`true`}),_.destructive]})}},w={args:{variant:`link`,children:_.link}},T={args:{children:(0,p.jsxs)(p.Fragment,{children:[`Cadastrar meu primeiro produto`,(0,p.jsx)(d,{"aria-hidden":`true`})]})}},E={args:{size:`icon`,"aria-label":`Adicionar produto`,children:(0,p.jsx)(i,{"aria-hidden":`true`})}},D={args:{disabled:!0,children:`Publicar loja`}},O={args:{loading:!0,children:`Salvando produto`}},k={args:{variant:`outline`},render:e=>(0,p.jsx)(l,{...e,asChild:!0,children:(0,p.jsx)(`a`,{href:`#pedidos`,children:`Ver meus pedidos`})})},A={parameters:{controls:{disable:!0}},render:()=>(0,p.jsx)(`div`,{className:`flex flex-col gap-6`,children:h.map(e=>(0,p.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[g.map(t=>(0,p.jsx)(l,{variant:e,size:t,children:_[e]},t)),(0,p.jsx)(l,{variant:e,size:`icon`,"aria-label":`Adicionar (${e})`,children:(0,p.jsx)(i,{"aria-hidden":`true`})}),(0,p.jsx)(l,{variant:e,disabled:!0,children:`Indisponível`}),(0,p.jsx)(l,{variant:e,loading:!0,children:`Salvando`})]},e))})},j=[`Default`,`Secondary`,`Outline`,`Ghost`,`Destructive`,`Link`,`WithIcon`,`IconOnly`,`Disabled`,`Loading`,`AsLink`,`AllVariants`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: VARIANT_LABELS.secondary
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    children: VARIANT_LABELS.outline
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: VARIANT_LABELS.ghost
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'destructive',
    children: <>
        <Trash aria-hidden="true" />
        {VARIANT_LABELS.destructive}
      </>
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: VARIANT_LABELS.link
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        Cadastrar meu primeiro produto
        <ArrowRight aria-hidden="true" />
      </>
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'icon',
    'aria-label': 'Adicionar produto',
    children: <Plus aria-hidden="true" />
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Publicar loja'
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    children: 'Salvando produto'
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline'
  },
  render: args => <Button {...args} asChild>
      <a href="#pedidos">Ver meus pedidos</a>
    </Button>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-6">
      {VARIANTS.map(variant => <div key={variant} className="flex flex-wrap items-center gap-3">
          {SIZES.map(size => <Button key={size} variant={variant} size={size}>
              {VARIANT_LABELS[variant]}
            </Button>)}
          <Button variant={variant} size="icon" aria-label={\`Adicionar (\${variant})\`}>
            <Plus aria-hidden="true" />
          </Button>
          <Button variant={variant} disabled>
            Indisponível
          </Button>
          <Button variant={variant} loading>
            Salvando
          </Button>
        </div>)}
    </div>
}`,...A.parameters?.docs?.source}}}})))()}M();export{A as AllVariants,k as AsLink,y as Default,C as Destructive,D as Disabled,S as Ghost,E as IconOnly,w as Link,O as Loading,x as Outline,b as Secondary,T as WithIcon,j as __namedExportsOrder,v as default};