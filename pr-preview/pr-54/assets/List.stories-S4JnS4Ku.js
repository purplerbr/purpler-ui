import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./package-open-Bfjc1GSV.js";import{i,n as a,r as o,t as s}from"./dist-Be47NwFh.js";import{n as c,t as l}from"./Button-Baz-k9Ie.js";import{n as u,t as d}from"./EmptyState-CwLjnbhX.js";var f;function p(){return(p=e((()=>{a(),f=s(`grid gap-2 text-start font-sans`,{variants:{marker:{disc:`list-outside list-disc ps-6`,none:`list-none`}},defaultVariants:{marker:`disc`}})})))()}function m({className:e,marker:t,...n}){return(0,g.jsx)(`ul`,{role:`list`,"data-slot":`list`,className:o(f({marker:t}),e),...n})}function h(e){return(0,g.jsx)(`li`,{"data-slot":`list-item`,...e})}var g;function _(){return(_=e((()=>{i(),p(),g=t(),m.__docgenInfo={description:"A bulleted (or unmarked) list of `ListItem`s, aligned to the start even inside centered blocks.",methods:[],displayName:`List`},h.__docgenInfo={description:``,methods:[],displayName:`ListItem`}})))()}var v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),c(),u(),_(),v=t(),y=[`disc`,`none`],b=[`Cadastre o primeiro produto, com foto e preço.`,`Conecte o seu meio de pagamento.`,`Divulgue o endereço da loja para os seus clientes.`],x={title:`Atoms/List`,component:m,tags:[`autodocs`],args:{marker:`disc`,children:b.map(e=>(0,v.jsx)(h,{children:e},e))},argTypes:{marker:{control:`select`,options:y,description:"`disc` mostra o marcador; `none` tira o marcador e o recuo"},children:{control:!1,description:"Um `ListItem` por item"}},parameters:{docs:{description:{component:"Lista de itens com marcador e recuo da marca. O texto fica alinhado ao início mesmo dentro de um bloco centralizado, como o `EmptyState`, sem classe no app. A lista continua sendo lida como lista pelo leitor de tela, também sem marcador."}}}},S={},C={args:{marker:`none`}},w={parameters:{controls:{disable:!0}},render:e=>(0,v.jsx)(d,{icon:(0,v.jsx)(r,{}),title:`Sua vitrine ainda está vazia`,description:`Três passos para receber o primeiro pedido:`,action:(0,v.jsx)(l,{children:`Cadastrar meu primeiro produto`}),children:(0,v.jsx)(m,{...e})})},T={parameters:{controls:{disable:!0}},render:()=>(0,v.jsx)(`div`,{className:`grid gap-8`,children:y.map(e=>(0,v.jsx)(m,{marker:e,children:b.map(e=>(0,v.jsx)(h,{children:e},e))},e))})},E=[`Default`,`WithoutMarker`,`InsideEmptyState`,`AllVariants`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    marker: 'none'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: args => <EmptyState icon={<PackageOpen />} title="Sua vitrine ainda está vazia" description="Três passos para receber o primeiro pedido:" action={<Button>Cadastrar meu primeiro produto</Button>}>
      <List {...args} />
    </EmptyState>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="grid gap-8">
      {MARKERS.map(marker => <List key={marker} marker={marker}>
          {STEPS.map(step => <ListItem key={step}>{step}</ListItem>)}
        </List>)}
    </div>
}`,...T.parameters?.docs?.source}}}})))()}D();export{T as AllVariants,S as Default,w as InsideEmptyState,C as WithoutMarker,E as __namedExportsOrder,x as default};