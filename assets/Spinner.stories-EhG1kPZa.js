import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./Spinner-DWZry58I.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),a=[`sm`,`md`,`lg`],o={title:`Atoms/Spinner`,component:r,tags:[`autodocs`],args:{label:`Carregando…`,showLabel:!1},argTypes:{size:{control:`select`,options:a,description:`Tamanho do anel`},label:{control:`text`,description:'Texto do `role="status"`; diga o que está carregando quando der'},showLabel:{control:`boolean`,description:`Mostra o texto ao lado do anel. Com movimento reduzido, o anel para e o texto aparece sempre`}},parameters:{docs:{description:{component:"Para o carregamento de rotas (o `fallback` do `<Suspense>` enquanto o chunk da página chega). Telas com dados mostram `Skeleton` no lugar do conteúdo (§7.2), não um `Spinner`."}}}},s={},c={args:{showLabel:!0,label:`Carregando pedidos…`}},l={args:{size:`sm`}},u={args:{size:`lg`}},d={parameters:{controls:{disable:!0},docs:{description:{story:'Use como `fallback` do `<Suspense>` das rotas: `<div className="grid min-h-dvh place-items-center"><Spinner size="lg" showLabel label="Carregando o painel…" /></div>`. O app só posiciona; o visual vem da lib.'}}},render:()=>(0,i.jsx)(`div`,{className:`grid min-h-dvh place-items-center`,children:(0,i.jsx)(r,{size:`lg`,showLabel:!0,label:`Carregando o painel…`})})},f={parameters:{controls:{disable:!0}},render:()=>(0,i.jsx)(`div`,{className:`flex flex-col gap-6`,children:a.map(e=>(0,i.jsxs)(`div`,{className:`flex flex-wrap items-center gap-8`,children:[(0,i.jsx)(r,{size:e,label:`Carregando (${e})…`}),(0,i.jsx)(r,{size:e,showLabel:!0,label:`Carregando (${e})…`})]},e))})},p=[`Default`,`WithLabel`,`Small`,`Large`,`PageLoading`,`AllVariants`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    showLabel: true,
    label: 'Carregando pedidos…'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      description: {
        story: 'Use como \`fallback\` do \`<Suspense>\` das rotas: \`<div className="grid min-h-dvh place-items-center"><Spinner size="lg" showLabel label="Carregando o painel…" /></div>\`. O app só posiciona; o visual vem da lib.'
      }
    }
  },
  render: () => <div className="grid min-h-dvh place-items-center">
      <Spinner size="lg" showLabel label="Carregando o painel…" />
    </div>
}`,...d.parameters?.docs?.source},description:{story:"Route fallback for `<Suspense>`: a centered spinner with a visible label, nothing else.",...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-6">
      {SIZES.map(size => <div key={size} className="flex flex-wrap items-center gap-8">
          <Spinner size={size} label={\`Carregando (\${size})…\`} />
          <Spinner size={size} showLabel label={\`Carregando (\${size})…\`} />
        </div>)}
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as AllVariants,s as Default,u as Large,d as PageLoading,l as Small,c as WithLabel,p as __namedExportsOrder,o as default};