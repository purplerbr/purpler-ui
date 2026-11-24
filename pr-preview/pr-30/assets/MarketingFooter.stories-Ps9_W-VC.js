import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./MarketingFooter-V27FUmaz.js";var i,a,o,s,c,l,u;function d(){return(d=e((()=>{n(),i=t(),a=[{href:`#planos`,label:`Planos`},{href:`#termos`,label:`Termos de uso`},{href:`#privacidade`,label:`Política de privacidade`}],o={title:`Organisms/MarketingFooter`,component:r,tags:[`autodocs`],args:{homeHref:`#`,links:a,tagline:`O balcão digital de quem empreende: sua loja, sua marca, seu dinheiro.`,contact:{label:`Fale com a gente:`,email:`contato@purpler.com.br`},note:`© 2026 Purpler. Todos os direitos reservados.`},argTypes:{homeHref:{control:`text`,description:`Destino do logo`},links:{control:`object`,description:`Links legais e secundários`},tagline:{control:`text`,description:`Frase curta embaixo do logo`},contact:{control:`object`,description:"Rótulo e e-mail de contato (vira `mailto:`)"},note:{control:`text`,description:`Última linha, como o copyright`}},parameters:{layout:`fullscreen`,docs:{description:{component:`Rodapé do site da Purpler, com a marca Purpler: logo, links legais e o e-mail de contato, que também recebe os pedidos sobre dados pessoais. Tudo vem por props e funciona sem JavaScript.`}}}},s={},c={render:({homeHref:e,links:t})=>(0,i.jsx)(r,{homeHref:e,links:t})},l={parameters:{controls:{disable:!0}},render:e=>(0,i.jsxs)(`div`,{className:`grid gap-8`,children:[(0,i.jsx)(r,{...e}),(0,i.jsx)(r,{homeHref:`#`,navLabel:`Rodapé resumido`,links:a.map(e=>({...e,current:e.label===`Termos de uso`}))})]})},u=[`Default`,`Minimal`,`AllVariants`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: ({
    homeHref,
    links
  }) => <MarketingFooter homeHref={homeHref} links={links} />
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}}})))()}d();export{l as AllVariants,s as Default,c as Minimal,u as __namedExportsOrder,o as default};