create table categorias (
  id text primary key,
  nome text not null,
  ordem int not null,
  oculta boolean not null default false
);

create table produtos (
  id text primary key,
  categoria_id text not null references categorias(id),
  nome text not null,
  imagem_url text,
  esgotado boolean not null default false,
  ordem int not null
);

alter table categorias enable row level security;
alter table produtos enable row level security;

create policy "leitura publica" on categorias for select using (true);
create policy "leitura publica" on produtos for select using (true);
