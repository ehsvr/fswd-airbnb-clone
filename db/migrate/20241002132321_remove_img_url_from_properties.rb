class RemoveImgUrlFromProperties < ActiveRecord::Migration[6.1]
  def change
    remove_column :properties, :img_url, :string
  end
end
