import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{i as n,n as r,r as i,t as a}from"./MarketingFooter-BaCw8EZX.js";var o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{r(),i(),o=t(),s=[{href:`#planos`,label:`Planos`},{href:`#termos`,label:`Termos de uso`},{href:`#privacidade`,label:`Política de privacidade`}],c={title:`Organisms/MarketingFooter`,component:a,tags:[`autodocs`],args:{homeHref:`#`,links:s,tagline:`O balcão digital de quem empreende: sua loja, sua marca, seu dinheiro.`,contact:{label:`Fale com a gente:`,email:`contato@purpler.com.br`},note:`© 2026 Purpler. Todos os direitos reservados.`},argTypes:{homeHref:{control:`text`,description:`Destino do logo`},links:{control:`object`,description:`Links legais e secundários`},tagline:{control:`text`,description:`Frase curta embaixo do logo`},contact:{control:`object`,description:"Rótulo e e-mail de contato (vira `mailto:`)"},note:{control:`text`,description:`Última linha, como o copyright`},action:{control:!1,description:`Item depois dos links, como o botão "Gerenciar cookies"`}},parameters:{layout:`fullscreen`,docs:{description:{component:`Rodapé do site da Purpler, com a marca Purpler: logo, links legais e o e-mail de contato, que também recebe os pedidos sobre dados pessoais. Tudo vem por props e funciona sem JavaScript.`}}}},l={},u={render:({homeHref:e,links:t})=>(0,o.jsx)(a,{homeHref:e,links:t})},d={args:{action:(0,o.jsx)(`button`,{type:`button`,className:n(),children:`Gerenciar cookies`})}},f={parameters:{controls:{disable:!0}},render:e=>(0,o.jsxs)(`div`,{className:`grid gap-8`,children:[(0,o.jsx)(a,{...e}),(0,o.jsx)(a,{homeHref:`#`,navLabel:`Rodapé resumido`,links:s.map(e=>({...e,current:e.label===`Termos de uso`}))})]})},p=[`Default`,`Minimal`,`WithAction`,`AllVariants`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: ({
    homeHref,
    links
  }) => <MarketingFooter homeHref={homeHref} links={links} />
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    action: <button type="button" className={marketingFooterLinkVariants()}>
        Gerenciar cookies
      </button>
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: args => <div className="grid gap-8">
      <MarketingFooter {...args} />
      <MarketingFooter homeHref="#" navLabel="Rodapé resumido" links={LINKS.map(link => ({
      ...link,
      current: link.label === 'Termos de uso'
    }))} />
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as AllVariants,l as Default,u as Minimal,d as WithAction,p as __namedExportsOrder,c as default};