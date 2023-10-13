import { decodeJWT } from "../utils/tokenHelpers";

const validateToken = async (
  cie: any,
  bearerToken: string,
  tenant_id: string
) => {
  let decoded = await decodeJWT(bearerToken);

  let token: any = await cie.read("tokens", {
    filterBy: [
      {
        attribute: "id",
        op: "eq",
        value: decoded.jti,
      },
      {
        attribute: "tenant_id",
        op: "eq",
        value: tenant_id,
      },
    ],
    transformations: ["pick_first"],
  });

  if (token.issuer === "user" || token.iss === "user") {
    const user: any = await cie.read("users", {
      filterBy: [
        {
          attribute: "id",
          op: "eq",
          value: token.sub,
        },
        {
          attribute: "tenant_id",
          op: "eq",
          value: tenant_id,
        },
      ],
      transformations: ["pick_first"],
    });

    if (token === null) {
      throw {
        statusCode: 403,
        message: "Unauthorized",
      };
    }

    return { token, decoded, user };
  }

  if (token.issuer === "admin" || token.iss === "admin") {
    const admin: any = await cie.read("admins", {
      filterBy: [
        {
          attribute: "id",
          op: "eq",
          value: token.sub,
        },
        {
          attribute: "tenant_id",
          op: "eq",
          value: tenant_id,
        },
      ],
      transformations: ["pick_first"],
    });

    if (token === null) {
      throw {
        statusCode: 403,
        message: "Unauthorized",
      };
    }

    return { token, decoded, admin };
  }
};

export default validateToken;
