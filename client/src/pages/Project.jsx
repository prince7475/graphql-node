import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useQuery } from "@apollo/client";
import { GET_PROJECT } from "../queries/projectQueries";
export default function Project() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });
  if (loading) return <Spinner />;
  if (error) return <p>Error :(</p>;
  const { name, status, description, clientId } = data.project;
  return <></>;
}
