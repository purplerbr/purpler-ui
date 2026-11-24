import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./Logo-BvQYnhr0.js";var i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i=t(),a=[`sm`,`md`,`lg`],o={title:`Atoms/Logo`,component:r,tags:[`autodocs`],args:{size:`md`},argTypes:{size:{control:`select`,options:a,description:`Altura do logo (24, 32 ou 40 px)`},"aria-label":{control:`text`,description:`Nome lido pelo leitor de tela. O padrão é “Purpler”; dentro de um link para a home, o link já leva esse nome`}},parameters:{docs:{description:{component:"Logo da Purpler (símbolo + nome) nas superfícies da marca: site, painel e login. Usa os tokens `brand-mark` e `brand-wordmark`, que o tema da loja não altera. Não use na loja, que mostra o logo do lojista."}}}},s={},c={args:{size:`sm`}},l={args:{size:`lg`}},u={parameters:{controls:{disable:!0}},render:()=>(0,i.jsx)(`div`,{className:`flex flex-wrap items-end gap-8`,children:a.map(e=>(0,i.jsx)(r,{size:e},e))})},d=[`Default`,`Small`,`Large`,`AllVariants`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-wrap items-end gap-8">
      {SIZES.map(size => <Logo key={size} size={size} />)}
    </div>
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as AllVariants,s as Default,l as Large,c as Small,d as __namedExportsOrder,o as default};