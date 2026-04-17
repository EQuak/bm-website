### Front-end Prompt Guide

Library:

- Mantine UI With Tailwind CSS
  - We use the the basic props from mantine ui, when the component has no complex UI, but when component need to have hover, diff media screen behavior we use tailwind classes to facilitate the styling.
  - Mantine UI documentaions is on https://mantine.dev/ the core components we add /core/ and then the component name like: https://mantine.dev/core/grid/, use this to get all props and utilities.
  - Manite has a helper compound classes and styles using classnames (open object and the key is the component, like a modal has classnames > body, so the class will be applied to the body.)
  - Mantine also has compound components, so, if the component has complexity, is better to use the compound component, and pass the props to the component.
- TRPC
  - we import the api from "#/trpc/react" if is a client component and from "#/trpc/server" if is a server component.
  - Client component we use useQuery if the component is not need for the first render, and useSuspenseQuery if the component need to be rendered on the first render.
  - Server component we use just call the function with await, without useQuery. Like: const data = await api.example.getAll(). We can also hydrate the date calling void api.example.getAll.prefetch() on the server component. and pass the <HydrateClient> to the component that need the data.
  - With TRPC we avoid using useEffect to call apis, so we try to control the state of the data on reactquery, builtin trpc.
  - If the trpc query need a url param, we or use useParams where we get the dinamic URL from next js, liks route/[param]/route, so we can get const {param} = useParams(); and pass it to the trpc query.
  - We use the second argument on usequery, called enabled, to just allow the query to run when the condition is met, like a button that trigger the query.
  - TYPES:
    - RouterOutput: This type has all return types of the tRPC routers, so we can get using [routerName].[functionName]., and we can inspect the type and get all properties and its types. Example: api.example.getAll.query = RouterOutput['example']['getAll'].
- React Hook Form
  - We not use the react hook form core, we use a fork from mantine/form, that is a little different, but is close to the core.
  - We have a sapareted file (useform.md) with more details about the useForm.
  - But if the form is too complex, we can make use of the react hook form default library.
- Types
  - We prefer Type over Interface.
  - We define top at top level of the componetn, not inside of the argument.
  - We don't export if is not necessary.
  - We define the component type
- State Control
  - !IMPORTANT
  - We avoid use useState if is not necessary, we prefer use urlSearchParams to control the state of the component, if is possible, because we can control the state of the component with the url and have the history browser to control also.
  - I create the apps/true-inventory/src/hooks/useSetQueryParams.tsx with some hooks to control the url state, so we can set the state using urlSearchParams, and get the state using useSearchParams.
  - Some times, useState with urlSearchParams is necessary, like when we need to control a form, or a modal state.
  - UseForm as state also:
    - Some forms, I use the form to also control some state of the component, so I avoid use 2 libraries (like zustand or useState + useForm). Normally I create the formType like:
      {
      states: {},
      form: {}
      }
      so I can use the obsersable from useForm to control the state of the form and the states to control other states of the component, without need to use zustand or useState.
- React Router
  - Next js has server and client components, useParams, useSearchParams is just available on client components. Redirect can be used on server components.

!IMPORTANT:

- Server and Client Components:
- In this project, we don't need to focus on server side rendering, is a ERP application, so, the state control and easier to use is more important than the server side or client side.
- So, we apply the rule, let's to in the server, the thing only can be done in the server, or the thing we maybe don't need to wait for a client load, like auth check, role check, middlewares, and also prefetching data, so we use a global suspense and loading component, so we the page load, we have less skeletons all over the place. We are not caring about google indexing, and crawlers, is only a internal tool, UX is more important.
