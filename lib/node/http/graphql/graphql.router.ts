import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { ApolloServer, ApolloServerOptions, BaseContext } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefaultOptions,
  ApolloServerPluginLandingPageLocalDefaultOptions,
} from '@apollo/server/plugin/landingPage/default';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginCacheControlOptions,
} from '@apollo/server/plugin/cacheControl';
import {
  expressMiddleware,
  ExpressMiddlewareOptions,
} from '@apollo/server/express4';
import { AppEnvironment } from '../../core/app-environment';
import { MZRouter, MZRouterOptions } from '../router';
import { MZCore } from '../../interfaces';
import { WithWritable } from '../../../interfaces';
import { WithRequired } from '../../../interfaces/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MZGraphqlRouterOptions<
  GraphqlContext extends BaseContext = BaseContext,
> extends MZRouterOptions {
  name?: string;

  // middleware CORS
  useCORS?: boolean; // default: false
  corsOptions?: cors.CorsOptions;
  corsOptionsDelegate?: cors.CorsOptionsDelegate;

  // middleware parse JSON
  useParseJSON?: boolean; // default: true
  parseJsonOptions?: Parameters<typeof express.json>[0];

  useApolloDrainHttpServer?: boolean; // default: true

  useApolloCacheControl?: boolean; // default: true
  apolloCacheControlOptions?: ApolloServerPluginCacheControlOptions;

  useApolloLandingPage?: boolean; // default: true
  apolloLandingPageOptions?: ApolloServerPluginLandingPageProductionDefaultOptions;
  apolloLandingPageLocalOptions?: ApolloServerPluginLandingPageLocalDefaultOptions;

  apolloServerOptions: WithRequired<
    ApolloServerOptions<GraphqlContext>,
    'typeDefs' | 'resolvers'
  >;
  expressMiddlewareOptions?: ExpressMiddlewareOptions<GraphqlContext>;
}

export class MZGraphqlRouter<
  GraphqlContext extends BaseContext = BaseContext,
> extends MZRouter {
  constructor(public readonly options: MZGraphqlRouterOptions<GraphqlContext>) {
    super(options);
    delete (this as any).router;
  }

  public getServer(app?: express.Express): ApolloServer<GraphqlContext> {
    const httpServer = app ? http.createServer(app) : undefined;
    const apolloServer = new ApolloServer({
      introspection: !AppEnvironment.instance.isProduction,
      ...this.options.apolloServerOptions,
      plugins: [
        // ApolloServerPluginDrainHttpServer
        this.options.useApolloDrainHttpServer !== false && httpServer
          ? ApolloServerPluginDrainHttpServer({ httpServer })
          : undefined,

        // ApolloServerPluginCacheControl
        this.options.useApolloCacheControl !== false
          ? ApolloServerPluginCacheControl({
              // Cache everything for 1 second by default.
              defaultMaxAge: 1,
              // Don't send the `cache-control` response header.
              calculateHttpHeaders: false,
              ...this.options.apolloCacheControlOptions,
            })
          : undefined,

        // ApolloServerPluginLandingPage
        ...(this.options.useApolloLandingPage !== false
          ? [
              AppEnvironment.instance.isProduction
                ? ApolloServerPluginLandingPageProductionDefault({
                    footer: false,
                    ...this.options.apolloLandingPageOptions,
                  })
                : ApolloServerPluginLandingPageLocalDefault({
                    footer: false,
                    ...this.options.apolloLandingPageLocalOptions,
                  }),
            ]
          : []),

        // Options plugins
        ...(this.options.apolloServerOptions.plugins || []),
      ].filter(Boolean) as any,
    } as ApolloServerOptions<GraphqlContext>);

    return apolloServer;
  }

  public override async assignRouter(app: express.Express) {
    if (this.options.enable === false) {
      return;
    }

    const apolloServer = this.getServer(app);
    await apolloServer.start();

    const bootstrapOptions = AppEnvironment.instance.bootstrapOptions;
    const graphqlPath = this.options.path || '/graphql';
    const middlewares = [
      // FIXME: duplicate app bootstrap - middleware CORS
      bootstrapOptions.useCORS
        ? undefined
        : this.options.useCORS
        ? cors(
            this.options.corsOptions ||
              this.options.corsOptionsDelegate ||
              bootstrapOptions.corsOptions ||
              bootstrapOptions.corsOptionsDelegate,
          )
        : undefined,

      // FIXME: duplicate app bootstrap - middleware parse JSON
      bootstrapOptions.useParseJSON !== false
        ? undefined
        : this.options.useParseJSON !== false
        ? express.json({
            verify: (
              req: MZCore.Request,
              _res: MZCore.Response,
              buf: Buffer,
              encoding: BufferEncoding,
            ): void => {
              if (buf && buf.length) {
                (req as WithWritable<MZCore.Request>).rawBody = buf.toString(
                  encoding || 'utf8',
                );
              }
            },
          })
        : undefined,

      expressMiddleware<any>(apolloServer, {
        ...this.options.expressMiddlewareOptions,
        context: async ({ req, res }) => {
          const ctx = this.options.expressMiddlewareOptions?.context
            ? await Promise.resolve(
                this.options.expressMiddlewareOptions.context({ req, res }),
              )
            : {};

          return { ...ctx };
        },
      }),
    ].filter(Boolean);

    app.use(graphqlPath, ...(middlewares as any));
  }
}
