import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./loader-circle-DD4MahW4.js";import{i,n as a,r as o,t as s}from"./dist-Be47NwFh.js";var c,l;function u(){return(u=e((()=>{a(),c=s(`shrink-0 animate-spin text-primary motion-reduce:animate-none`,{variants:{size:{sm:`size-4`,md:`size-6`,lg:`size-10`}},defaultVariants:{size:`md`}}),l=s(`inline-flex items-center gap-2 font-sans`,{variants:{size:{sm:`text-small`,md:`text-small`,lg:`text-body`}},defaultVariants:{size:`md`}})})))()}function d({className:e,size:t,label:n=`Carregando…`,showLabel:i=!1,...a}){return(0,f.jsxs)(`span`,{"data-slot":`spinner`,className:o(l({size:t}),e),...a,role:`status`,"aria-label":n,children:[(0,f.jsx)(r,{"aria-hidden":`true`,className:c({size:t})}),(0,f.jsx)(`span`,{"data-slot":`spinner-label`,className:i?void 0:`sr-only motion-reduce:not-sr-only`,children:n})]})}var f;function p(){return(p=e((()=>{n(),i(),u(),f=t(),d.__docgenInfo={description:"For lazy route chunks (the `<Suspense>` fallback); data screens use `Skeleton` (§7.2).",methods:[],displayName:`Spinner`,props:{label:{required:!1,tsType:{name:`string`},description:"Text announced by screen readers; also shown when `showLabel` is on.",defaultValue:{value:`'Carregando…'`,computed:!1}},showLabel:{required:!1,tsType:{name:`boolean`},description:`Shows the label next to the ring; it always shows when the user asks for reduced motion.`,defaultValue:{value:`false`,computed:!1}}}}})))()}var m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{p(),m=t(),h=[`sm`,`md`,`lg`],g={title:`Atoms/Spinner`,component:d,tags:[`autodocs`],args:{label:`Carregando…`,showLabel:!1},argTypes:{size:{control:`select`,options:h,description:`Tamanho do anel`},label:{control:`text`,description:'Texto do `role="status"`; diga o que está carregando quando der'},showLabel:{control:`boolean`,description:`Mostra o texto ao lado do anel. Com movimento reduzido, o anel para e o texto aparece sempre`}},parameters:{docs:{description:{component:"Para o carregamento de rotas (o `fallback` do `<Suspense>` enquanto o chunk da página chega). Telas com dados mostram `Skeleton` no lugar do conteúdo (§7.2), não um `Spinner`."}}}},_={},v={args:{showLabel:!0,label:`Carregando pedidos…`}},y={args:{size:`sm`}},b={args:{size:`lg`}},x={parameters:{controls:{disable:!0},docs:{description:{story:'Use como `fallback` do `<Suspense>` das rotas: `<div className="grid min-h-dvh place-items-center"><Spinner size="lg" showLabel label="Carregando o painel…" /></div>`. O app só posiciona; o visual vem da lib.'}}},render:()=>(0,m.jsx)(`div`,{className:`grid min-h-dvh place-items-center`,children:(0,m.jsx)(d,{size:`lg`,showLabel:!0,label:`Carregando o painel…`})})},S={parameters:{controls:{disable:!0}},render:()=>(0,m.jsx)(`div`,{className:`flex flex-col gap-6`,children:h.map(e=>(0,m.jsxs)(`div`,{className:`flex flex-wrap items-center gap-8`,children:[(0,m.jsx)(d,{size:e,label:`Carregando (${e})…`}),(0,m.jsx)(d,{size:e,showLabel:!0,label:`Carregando (${e})…`})]},e))})},C=[`Default`,`WithLabel`,`Small`,`Large`,`PageLoading`,`AllVariants`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    showLabel: true,
    label: 'Carregando pedidos…'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source},description:{story:"Route fallback for `<Suspense>`: a centered spinner with a visible label, nothing else.",...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as AllVariants,_ as Default,b as Large,x as PageLoading,y as Small,v as WithLabel,C as __namedExportsOrder,g as default};