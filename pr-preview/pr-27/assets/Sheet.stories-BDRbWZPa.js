import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{a as n,c as r,i,l as a,n as o,o as s,r as c,s as l,t as u}from"./Sheet-Dj0dmTTa.js";import{n as d,t as f}from"./Button-Baz-k9Ie.js";function p({side:e,defaultOpen:t=!1}){return(0,m.jsxs)(u,{defaultOpen:t,children:[(0,m.jsx)(r,{asChild:!0,children:(0,m.jsx)(f,{variant:`outline`,children:`Ver resumo do pedido`})}),(0,m.jsxs)(c,{side:e,children:[(0,m.jsxs)(s,{children:[(0,m.jsx)(l,{children:`Resumo do pedido`}),(0,m.jsx)(i,{children:`Confira os itens antes de seguir para o pagamento.`})]}),(0,m.jsx)(`p`,{className:`px-4 text-body`,children:`2 itens · frete calculado no próximo passo.`}),(0,m.jsx)(n,{children:(0,m.jsx)(o,{asChild:!0,children:(0,m.jsx)(f,{children:`Continuar comprando`})})})]})]})}var m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{d(),a(),m=t(),h=[`right`,`left`,`top`,`bottom`],g={title:`Molecules/Sheet`,component:c,tags:[`autodocs`],args:{side:`right`,closeLabel:`Fechar`},argTypes:{side:{control:`select`,options:h,description:`Borda da tela de onde o painel sai`},closeLabel:{control:`text`,description:`Nome do botão de fechar para o leitor de tela`}},parameters:{docs:{description:{component:"Painel lateral sobre o Dialog do Radix: prende o foco dentro dele, fecha com Esc ou no botão de fechar e devolve o foco a quem o abriu. Todo painel precisa de `SheetTitle`; sem descrição, passe `aria-describedby={undefined}` ao `SheetContent`. Ele depende de JavaScript: numa página pré-renderizada, deixe um caminho que funcione sem ele (veja o `MarketingHeader`)."}}},render:({side:e})=>(0,m.jsx)(p,{side:e})},_={},v={render:({side:e})=>(0,m.jsx)(p,{side:e,defaultOpen:!0})},y={args:{side:`left`}},b={parameters:{controls:{disable:!0}},render:()=>(0,m.jsx)(`div`,{className:`flex flex-wrap gap-3`,children:h.map(e=>(0,m.jsxs)(u,{children:[(0,m.jsx)(r,{asChild:!0,children:(0,m.jsxs)(f,{variant:`outline`,children:[`Abrir painel (`,e,`)`]})}),(0,m.jsx)(c,{side:e,"aria-describedby":void 0,children:(0,m.jsx)(s,{children:(0,m.jsxs)(l,{children:[`Painel (`,e,`)`]})})})]},e))})},x=[`Default`,`Open`,`Left`,`AllVariants`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: ({
    side
  }) => <Example side={side} defaultOpen />
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    side: 'left'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-wrap gap-3">
      {SIDES.map(side => <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">Abrir painel ({side})</Button>
          </SheetTrigger>
          <SheetContent side={side} aria-describedby={undefined}>
            <SheetHeader>
              <SheetTitle>Painel ({side})</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>)}
    </div>
}`,...b.parameters?.docs?.source}}}})))()}S();export{b as AllVariants,_ as Default,y as Left,v as Open,x as __namedExportsOrder,g as default};