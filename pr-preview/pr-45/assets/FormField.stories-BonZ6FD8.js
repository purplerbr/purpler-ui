import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DvvP-0SR.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{i as r,n as i,r as a,t as o}from"./dist-Be47NwFh.js";import{i as s,t as c}from"./dist-C1ibx4s1.js";import{n as l,r as u,t as d}from"./RadioGroup-DaVRgtkg.js";import{n as f,t as p}from"./Label-CalzIVEF.js";import{n as m,t as h}from"./Button-Baz-k9Ie.js";import{n as g,t as _}from"./Input-1zptAiVN.js";var v,y,b;function x(){return(x=e((()=>{i(),v=o(`flex w-full flex-col gap-1.5`),y=o(`text-small text-muted-foreground`),b=o(`text-small font-semibold text-destructive`)})))()}function S({className:e,label:t,description:n,error:r,id:i,children:o,...s}){let l=(0,C.useId)(),u=o.props.id??i??l,d=`${u}-label`,f=n===void 0?void 0:`${u}-description`,m=r?`${u}-error`:void 0,h=[f,m].filter(Boolean).join(` `)||void 0;return(0,w.jsxs)(`div`,{"data-slot":`form-field`,"data-invalid":r?!0:void 0,className:a(v(),e),...s,children:[(0,w.jsx)(p,{id:d,htmlFor:u,children:t}),(0,w.jsx)(c,{id:u,"aria-labelledby":d,"aria-describedby":h,"aria-invalid":r?!0:void 0,children:o}),n!==void 0&&(0,w.jsx)(`p`,{id:f,"data-slot":`form-field-description`,className:y(),children:n}),r&&(0,w.jsx)(`p`,{id:m,role:`alert`,"data-slot":`form-field-error`,className:b(),children:r})]})}var C,w;function T(){return(T=e((()=>{s(),C=t(),f(),r(),x(),w=n(),S.__docgenInfo={description:``,methods:[],displayName:`FormField`,props:{label:{required:!0,tsType:{name:`ReactNode`},description:``},description:{required:!1,tsType:{name:`ReactNode`},description:`Help text under the control, read after its name.`},error:{required:!1,tsType:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}]},description:"Error message; when set the control gets `aria-invalid` and the message is announced."},id:{required:!1,tsType:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}]},description:`Id of the control; generated when missing.`},children:{required:!0,tsType:{name:`ReactElement`,elements:[{name:`signature`,type:`object`,raw:`{ id?: string | undefined }`,signature:{properties:[{key:`id`,value:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}],required:!1}}]}}],raw:`ReactElement<{ id?: string | undefined }>`},description:"One control (`Input`, `RadioGroup`…); it receives the id and the ARIA links."}}}})))()}function E(){let[e,t]=(0,D.useState)({}),n=(0,D.useRef)(null),r=(0,D.useRef)(null);function i(e){e.preventDefault();let i=n.current?.value.trim()??``,a=r.current?.value??``,o={name:i?void 0:`Informe o nome da loja.`,slug:/^[a-z0-9-]{3,}$/.test(a)?void 0:`Use ao menos 3 letras minúsculas, números ou hífen.`};t(o),o.name?n.current?.focus():o.slug&&r.current?.focus()}return(0,O.jsxs)(`form`,{"aria-label":`Criar loja`,noValidate:!0,onSubmit:i,className:`flex flex-col gap-4`,children:[(0,O.jsx)(S,{label:`Nome da loja`,error:e.name,children:(0,O.jsx)(_,{ref:n,name:`name`,autoComplete:`organization`})}),(0,O.jsx)(S,{label:`Endereço da loja`,description:k,error:e.slug,children:(0,O.jsx)(_,{ref:r,name:`slug`,suffix:`.purpler.com.br`,autoCapitalize:`none`})}),(0,O.jsx)(h,{type:`submit`,className:`self-start`,children:`Criar loja`})]})}var D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{D=t(),m(),g(),u(),T(),O=n(),k=`Só letras minúsculas, números e hífen. Dá para trocar depois.`,A={title:`Molecules/FormField`,component:S,tags:[`autodocs`],args:{label:`Endereço da loja`,description:k,error:``,children:(0,O.jsx)(_,{placeholder:`docesdaana`,suffix:`.purpler.com.br`})},argTypes:{label:{control:`text`,description:`Nome visível do campo`},description:{control:`text`,description:`Ajuda abaixo do campo, lida depois do nome`},error:{control:`text`,description:"Mensagem de erro; marca o campo com `aria-invalid` e é anunciada ao aparecer"},children:{control:!1,description:"Um único controle (`Input`, `RadioGroup`…)"}},decorators:[e=>(0,O.jsx)(`div`,{className:`max-w-md`,children:(0,O.jsx)(e,{})})]},j={},M={args:{error:`Esse endereço já está em uso. Tente outro.`}},N={args:{label:`Plano`,description:`Você pode mudar de plano quando quiser.`,children:(0,O.jsxs)(d,{variant:`card`,defaultValue:`basic`,children:[(0,O.jsx)(l,{value:`basic`,label:`Básico`,description:`Grátis · até 30 produtos`}),(0,O.jsx)(l,{value:`enterprise`,label:`Enterprise`,description:`R$ 149,99/mês · até 150 produtos`,badge:`Em breve`,disabled:!0})]})}},P={parameters:{controls:{disable:!0}},render:()=>(0,O.jsx)(E,{})},F={parameters:{controls:{disable:!0}},render:()=>(0,O.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,O.jsx)(S,{label:`Nome da loja`,children:(0,O.jsx)(_,{placeholder:`Doces da Ana`})}),(0,O.jsx)(S,{label:`Endereço da loja`,description:k,children:(0,O.jsx)(_,{placeholder:`docesdaana`,suffix:`.purpler.com.br`})}),(0,O.jsx)(S,{label:`Endereço com erro`,description:k,error:`Esse endereço já está em uso. Tente outro.`,children:(0,O.jsx)(_,{defaultValue:`docesdaana`,suffix:`.purpler.com.br`})}),(0,O.jsx)(S,{label:`Preço`,error:`Informe um valor maior que zero.`,children:(0,O.jsx)(_,{defaultValue:`0,00`,prefix:`R$`,inputMode:`decimal`})}),(0,O.jsx)(S,{label:`E-mail da conta`,description:`Vem da sua conta Google.`,children:(0,O.jsx)(_,{type:`email`,defaultValue:`ana@docesdaana.com.br`,disabled:!0})}),(0,O.jsx)(S,{label:`Plano`,error:`Escolha um plano para continuar.`,children:(0,O.jsxs)(d,{variant:`card`,children:[(0,O.jsx)(l,{value:`basic`,label:`Básico`,description:`Grátis · até 30 produtos`}),(0,O.jsx)(l,{value:`professional`,label:`Profissional`,description:`R$ 79,99/mês · até 100 produtos`})]})})]})},I=[`Default`,`WithError`,`WithRadioGroup`,`ValidationFlow`,`AllVariants`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Esse endereço já está em uso. Tente outro.'
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Plano',
    description: 'Você pode mudar de plano quando quiser.',
    children: <RadioGroup variant="card" defaultValue="basic">
        <RadioGroupItem value="basic" label="Básico" description="Grátis · até 30 produtos" />
        <RadioGroupItem value="enterprise" label="Enterprise" description="R$ 149,99/mês · até 150 produtos" badge="Em breve" disabled />
      </RadioGroup>
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <CreateStoreForm />
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-6">
      <FormField label="Nome da loja">
        <Input placeholder="Doces da Ana" />
      </FormField>
      <FormField label="Endereço da loja" description={SLUG_HELP}>
        <Input placeholder="docesdaana" suffix=".purpler.com.br" />
      </FormField>
      <FormField label="Endereço com erro" description={SLUG_HELP} error="Esse endereço já está em uso. Tente outro.">
        <Input defaultValue="docesdaana" suffix=".purpler.com.br" />
      </FormField>
      <FormField label="Preço" error="Informe um valor maior que zero.">
        <Input defaultValue="0,00" prefix="R$" inputMode="decimal" />
      </FormField>
      <FormField label="E-mail da conta" description="Vem da sua conta Google.">
        <Input type="email" defaultValue="ana@docesdaana.com.br" disabled />
      </FormField>
      <FormField label="Plano" error="Escolha um plano para continuar.">
        <RadioGroup variant="card">
          <RadioGroupItem value="basic" label="Básico" description="Grátis · até 30 produtos" />
          <RadioGroupItem value="professional" label="Profissional" description="R$ 79,99/mês · até 100 produtos" />
        </RadioGroup>
      </FormField>
    </div>
}`,...F.parameters?.docs?.source}}}})))()}L();export{F as AllVariants,j as Default,P as ValidationFlow,M as WithError,N as WithRadioGroup,I as __namedExportsOrder,A as default};